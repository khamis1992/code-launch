import { convertToCoreMessages, streamText as _streamText, type Message } from 'ai';
import { MAX_TOKENS, PROVIDER_COMPLETION_LIMITS, isReasoningModel, type FileMap } from './constants';
import { getSystemPrompt } from '~/lib/common/prompts/prompts';
import { DEFAULT_MODEL, DEFAULT_PROVIDER, MODIFICATIONS_TAG_NAME, PROVIDER_LIST, WORK_DIR } from '~/utils/constants';
import type { IProviderSetting } from '~/types/model';
import { PromptLibrary } from '~/lib/common/prompt-library';
import { allowedHTMLElements } from '~/utils/markdown';
import { LLMManager } from '~/lib/modules/llm/manager';
import { createScopedLogger } from '~/utils/logger';
import { createFilesContext, extractPropertiesFromMessage } from './utils';
import { discussPrompt } from '~/lib/common/prompts/discuss-prompt';
import type { DesignScheme } from '~/types/design-scheme';
import { chunkMessages, mergeChunkResults, createChunkSummary, type ChunkedMessage } from './message-chunker';
import { getModelLimitsWithDefaults, validateTokenRequest } from './model-limits';

export type Messages = Message[];

export interface StreamingOptions extends Omit<Parameters<typeof _streamText>[0], 'model'> {
  supabaseConnection?: {
    isConnected: boolean;
    hasSelectedProject: boolean;
    credentials?: {
      anonKey?: string;
      supabaseUrl?: string;
    };
  };
}

const logger = createScopedLogger('stream-text');

function getCompletionTokenLimit(modelDetails: any): number {
  // 1. استخدام قاعدة بيانات حدود النماذج الجديدة
  const modelLimits = getModelLimitsWithDefaults(modelDetails.name, modelDetails.provider);

  // 2. إذا كان النموذج يحدد حدوده الخاصة، نستخدم الأصغر بين القيمتين للأمان
  if (modelDetails.maxCompletionTokens && modelDetails.maxCompletionTokens > 0) {
    return Math.min(modelDetails.maxCompletionTokens, modelLimits.maxCompletionTokens);
  }

  // 3. استخدام حدود قاعدة البيانات
  return modelLimits.maxCompletionTokens;
}

function sanitizeText(text: string): string {
  let sanitized = text.replace(/<div class=\\"__boltThought__\\">.*?<\/div>/s, '');
  sanitized = sanitized.replace(/<think>.*?<\/think>/s, '');
  sanitized = sanitized.replace(/<boltAction type="file" filePath="package-lock\.json">[\s\S]*?<\/boltAction>/g, '');

  return sanitized.trim();
}

/**
 * معالجة chunk واحد من الرسائل
 */
async function processMessageChunk(
  chunk: ChunkedMessage,
  systemPrompt: string,
  modelDetails: any,
  provider: any,
  apiKeys: Record<string, string> | undefined,
  providerSettings: Record<string, IProviderSetting> | undefined,
  serverEnv: Env | undefined,
  options: StreamingOptions | undefined,
  previousResults: string[],
): Promise<string> {
  const chunkLogger = createScopedLogger('stream-text-chunk');

  // إضافة ملخص الأجزاء السابقة إذا كان هذا ليس الجزء الأول
  let contextualSystemPrompt = systemPrompt;

  if (chunk.chunkIndex > 0 && previousResults.length > 0) {
    const summary = createChunkSummary(previousResults);
    contextualSystemPrompt = `${systemPrompt}\n\n${summary}`;
  }

  // إضافة معلومات التقسيم للسياق
  if (chunk.isPartial) {
    contextualSystemPrompt += `\n\nملاحظة: هذا الجزء ${chunk.chunkIndex + 1} من ${chunk.totalChunks} من الطلب الكامل. يرجى تقديم إجابة جزئية مناسبة.`;
  }

  const dynamicMaxTokens = modelDetails ? getCompletionTokenLimit(modelDetails) : Math.min(MAX_TOKENS, 16384);
  const safeMaxTokens = Math.min(dynamicMaxTokens, modelDetails.maxCompletionTokens || dynamicMaxTokens);

  chunkLogger.info(`معالجة الجزء ${chunk.chunkIndex + 1}/${chunk.totalChunks}, الـ tokens المسموحة: ${safeMaxTokens}`);

  const isReasoning = isReasoningModel(modelDetails.name);
  const tokenParams = isReasoning ? { maxCompletionTokens: safeMaxTokens } : { maxTokens: safeMaxTokens };

  const filteredOptions =
    isReasoning && options
      ? Object.fromEntries(
          Object.entries(options).filter(
            ([key]) =>
              ![
                'temperature',
                'topP',
                'presencePenalty',
                'frequencyPenalty',
                'logprobs',
                'topLogprobs',
                'logitBias',
              ].includes(key),
          ),
        )
      : options || {};

  try {
    const result = await _streamText({
      model: provider.getModelInstance({
        model: modelDetails.name,
        serverEnv,
        apiKeys,
        providerSettings,
      }),
      system: contextualSystemPrompt,
      messages: convertToCoreMessages(chunk.messages),
      ...tokenParams,
      ...filteredOptions,
    });

    let responseText = '';

    for await (const textPart of result.textStream) {
      responseText += textPart;
    }

    return responseText;
  } catch (error) {
    chunkLogger.error(`خطأ في معالجة الجزء ${chunk.chunkIndex + 1}:`, error);
    throw error;
  }
}

export async function streamText(props: {
  messages: Omit<Message, 'id'>[];
  env?: Env;
  options?: StreamingOptions;
  apiKeys?: Record<string, string>;
  files?: FileMap;
  providerSettings?: Record<string, IProviderSetting>;
  promptId?: string;
  contextOptimization?: boolean;
  contextFiles?: FileMap;
  summary?: string;
  messageSliceId?: number;
  chatMode?: 'discuss' | 'build';
  designScheme?: DesignScheme;
}) {
  const {
    messages,
    env: serverEnv,
    options,
    apiKeys,
    files,
    providerSettings,
    promptId,
    contextOptimization,
    contextFiles,
    summary,
    chatMode,
    designScheme,
  } = props;
  let currentModel = DEFAULT_MODEL;
  let currentProvider = DEFAULT_PROVIDER.name;
  let processedMessages = messages.map((message) => {
    const newMessage = { ...message };

    if (message.role === 'user') {
      const { model, provider, content } = extractPropertiesFromMessage(message);
      currentModel = model;
      currentProvider = provider;
      newMessage.content = sanitizeText(content);
    } else if (message.role == 'assistant') {
      newMessage.content = sanitizeText(message.content);
    }

    // Sanitize all text parts in parts array, if present
    if (Array.isArray(message.parts)) {
      newMessage.parts = message.parts.map((part) =>
        part.type === 'text' ? { ...part, text: sanitizeText(part.text) } : part,
      );
    }

    return newMessage;
  });

  const provider = PROVIDER_LIST.find((p) => p.name === currentProvider) || DEFAULT_PROVIDER;
  const staticModels = LLMManager.getInstance().getStaticModelListFromProvider(provider);
  let modelDetails = staticModels.find((m) => m.name === currentModel);

  if (!modelDetails) {
    const modelsList = [
      ...(provider.staticModels || []),
      ...(await LLMManager.getInstance().getModelListFromProvider(provider, {
        apiKeys,
        providerSettings,
        serverEnv: serverEnv as any,
      })),
    ];

    if (!modelsList.length) {
      throw new Error(`No models found for provider ${provider.name}`);
    }

    modelDetails = modelsList.find((m) => m.name === currentModel);

    if (!modelDetails) {
      // Check if it's a Google provider and the model name looks like it might be incorrect
      if (provider.name === 'Google' && currentModel.includes('2.5')) {
        throw new Error(
          `Model "${currentModel}" not found. Gemini 2.5 Pro doesn't exist. Available Gemini models include: gemini-1.5-pro, gemini-2.0-flash, gemini-1.5-flash. Please select a valid model.`,
        );
      }

      // Fallback to first model with warning
      logger.warn(
        `MODEL [${currentModel}] not found in provider [${provider.name}]. Falling back to first model. ${modelsList[0].name}`,
      );
      modelDetails = modelsList[0];
    }
  }

  const dynamicMaxTokens = modelDetails ? getCompletionTokenLimit(modelDetails) : Math.min(MAX_TOKENS, 16384);

  // التحقق من صحة الطلب
  const validation = validateTokenRequest(modelDetails.name, modelDetails.provider, dynamicMaxTokens);

  if (!validation.valid) {
    logger.error(`Token validation failed: ${validation.error}`);

    // استخدام الحد الأقصى الفعلي بدلاً من الرقم المطلوب
  }

  const safeMaxTokens = validation.actualLimit;

  logger.info(
    `Token limits for model ${modelDetails.name}: safeMaxTokens=${safeMaxTokens}, actualLimit=${validation.actualLimit}, maxTokenAllowed=${modelDetails.maxTokenAllowed}`,
  );

  let systemPrompt =
    PromptLibrary.getPropmtFromLibrary(promptId || 'default', {
      cwd: WORK_DIR,
      allowedHtmlElements: allowedHTMLElements,
      modificationTagName: MODIFICATIONS_TAG_NAME,
      designScheme,
      supabase: {
        isConnected: options?.supabaseConnection?.isConnected || false,
        hasSelectedProject: options?.supabaseConnection?.hasSelectedProject || false,
        credentials: options?.supabaseConnection?.credentials || undefined,
      },
    }) ?? getSystemPrompt();

  if (chatMode === 'build' && contextFiles && contextOptimization) {
    const codeContext = createFilesContext(contextFiles, true);

    systemPrompt = `${systemPrompt}

    Below is the artifact containing the context loaded into context buffer for you to have knowledge of and might need changes to fullfill current user request.
    CONTEXT BUFFER:
    ---
    ${codeContext}
    ---
    `;

    if (summary) {
      systemPrompt = `${systemPrompt}
      below is the chat history till now
      CHAT SUMMARY:
      ---
      ${props.summary}
      ---
      `;

      if (props.messageSliceId) {
        processedMessages = processedMessages.slice(props.messageSliceId);
      } else {
        const lastMessage = processedMessages.pop();

        if (lastMessage) {
          processedMessages = [lastMessage];
        }
      }
    }
  }

  const effectiveLockedFilePaths = new Set<string>();

  if (files) {
    for (const [filePath, fileDetails] of Object.entries(files)) {
      if (fileDetails?.isLocked) {
        effectiveLockedFilePaths.add(filePath);
      }
    }
  }

  if (effectiveLockedFilePaths.size > 0) {
    const lockedFilesListString = Array.from(effectiveLockedFilePaths)
      .map((filePath) => `- ${filePath}`)
      .join('\n');
    systemPrompt = `${systemPrompt}

    IMPORTANT: The following files are locked and MUST NOT be modified in any way. Do not suggest or make any changes to these files. You can proceed with the request but DO NOT make any changes to these files specifically:
    ${lockedFilesListString}
    ---
    `;
  } else {
    console.log('No locked files found from any source for prompt.');
  }

  logger.info(`Sending llm call to ${provider.name} with model ${modelDetails.name}`);

  // تقسيم الرسائل إذا كانت تتجاوز الحد المسموح
  const systemPromptTokens = Math.ceil(systemPrompt.length / 4); // تقدير تقريبي
  const chunks = chunkMessages(processedMessages, safeMaxTokens, systemPromptTokens);

  if (chunks.length === 1 && !chunks[0].isPartial) {
    // لا حاجة للتقسيم، معالجة عادية
    logger.info('الرسائل تدخل ضمن الحد المسموح، معالجة عادية');

    const isReasoning = isReasoningModel(modelDetails.name);
    const tokenParams = isReasoning ? { maxCompletionTokens: safeMaxTokens } : { maxTokens: safeMaxTokens };

    const filteredOptions =
      isReasoning && options
        ? Object.fromEntries(
            Object.entries(options).filter(
              ([key]) =>
                ![
                  'temperature',
                  'topP',
                  'presencePenalty',
                  'frequencyPenalty',
                  'logprobs',
                  'topLogprobs',
                  'logitBias',
                ].includes(key),
            ),
          )
        : options || {};

    const streamParams = {
      model: provider.getModelInstance({
        model: modelDetails.name,
        serverEnv,
        apiKeys,
        providerSettings,
      }),
      system: chatMode === 'build' ? systemPrompt : discussPrompt(),
      ...tokenParams,
      messages: convertToCoreMessages(processedMessages as any),
      ...filteredOptions,
      ...(isReasoning ? { temperature: 1 } : {}),
    };

    return await _streamText(streamParams);
  } else {
    // معالجة الرسائل المقسمة
    logger.info(`تقسيم الرسائل إلى ${chunks.length} جزء للمعالجة`);

    const results: string[] = [];

    for (const chunk of chunks) {
      try {
        const result = await processMessageChunk(
          chunk,
          chatMode === 'build' ? systemPrompt : discussPrompt(),
          modelDetails,
          provider,
          apiKeys,
          providerSettings,
          serverEnv,
          options,
          results,
        );

        results.push(result);
        logger.info(`تم إكمال الجزء ${chunk.chunkIndex + 1}/${chunk.totalChunks}`);
      } catch (error) {
        logger.error(`فشل في معالجة الجزء ${chunk.chunkIndex + 1}:`, error);

        // في حالة فشل أحد الأجزاء، نحاول المتابعة مع باقي الأجزاء
        results.push(
          `خطأ في الجزء ${chunk.chunkIndex + 1}: ${error instanceof Error ? error.message : 'خطأ غير محدد'}`,
        );
      }
    }

    // دمج النتائج وإرجاعها كـ stream
    const mergedResult = mergeChunkResults(results);

    // إنشاء stream مصطنع للنتيجة المدمجة
    return {
      textStream: (async function* () {
        yield mergedResult;
      })(),
      text: Promise.resolve(mergedResult),
      finishReason: Promise.resolve('stop' as const),
      usage: Promise.resolve({
        promptTokens:
          systemPromptTokens +
          chunks.reduce(
            (total, chunk) =>
              total +
              chunk.messages.reduce(
                (msgTotal, msg) =>
                  msgTotal + (typeof msg.content === 'string' ? Math.ceil(msg.content.length / 4) : 100),
                0,
              ),
            0,
          ),
        completionTokens: Math.ceil(mergedResult.length / 4),
        totalTokens: 0,
      }),
    };
  }
}
