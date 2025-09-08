import type { Message } from 'ai';
import { createScopedLogger } from '~/utils/logger';

const logger = createScopedLogger('message-chunker');

export interface ChunkedMessage {
  messages: Omit<Message, 'id'>[];
  isPartial: boolean;
  chunkIndex: number;
  totalChunks: number;
}

/**
 * تقدير عدد الـ tokens في النص
 * استخدام تقدير تقريبي: كلمة واحدة ≈ 1.3 token
 */
function estimateTokenCount(text: string): number {
  const words = text.split(/\s+/).length;
  return Math.ceil(words * 1.3);
}

/**
 * حساب عدد الـ tokens في رسالة واحدة
 */
function calculateMessageTokens(message: Omit<Message, 'id'>): number {
  let tokenCount = 0;

  if (typeof message.content === 'string') {
    tokenCount += estimateTokenCount(message.content);
  } else if (Array.isArray(message.content)) {
    for (const part of message.content as any[]) {
      if (part.type === 'text') {
        tokenCount += estimateTokenCount(part.text);
      }
    }
  }

  // إضافة tokens إضافية للـ metadata والتنسيق
  tokenCount += 50;

  return tokenCount;
}

/**
 * حساب إجمالي الـ tokens في مجموعة من الرسائل
 */
function calculateTotalTokens(messages: Omit<Message, 'id'>[]): number {
  return messages.reduce((total, message) => {
    return total + calculateMessageTokens(message);
  }, 0);
}

/**
 * تقسيم النص الطويل إلى أجزاء أصغر
 */
function splitLongText(text: string, maxTokens: number): string[] {
  const estimatedTokens = estimateTokenCount(text);

  if (estimatedTokens <= maxTokens) {
    return [text];
  }

  const chunks: string[] = [];
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);

  let currentChunk = '';
  let currentTokens = 0;

  for (const sentence of sentences) {
    const sentenceTokens = estimateTokenCount(sentence);

    if (currentTokens + sentenceTokens > maxTokens && currentChunk) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
      currentTokens = sentenceTokens;
    } else {
      currentChunk += (currentChunk ? '. ' : '') + sentence;
      currentTokens += sentenceTokens;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

/**
 * تقسيم رسالة واحدة إلى عدة رسائل أصغر
 */
function chunkSingleMessage(message: Omit<Message, 'id'>, maxTokens: number): Omit<Message, 'id'>[] {
  const messageTokens = calculateMessageTokens(message);

  if (messageTokens <= maxTokens) {
    return [message];
  }

  const chunks: Omit<Message, 'id'>[] = [];

  if (typeof message.content === 'string') {
    const textChunks = splitLongText(message.content, maxTokens - 100); // احتياط للـ metadata

    textChunks.forEach((chunk, index) => {
      chunks.push({
        ...message,
        content: index === 0 ? chunk : `(الجزء ${index + 1})\n\n${chunk}`,
      });
    });
  } else if (Array.isArray(message.content)) {
    // للرسائل متعددة الأجزاء، نقسم الأجزاء النصية فقط
    const textParts = (message.content as any[]).filter((part: any) => part.type === 'text');
    const nonTextParts = (message.content as any[]).filter((part: any) => part.type !== 'text');

    if (textParts.length === 0) {
      return [message]; // لا توجد أجزاء نصية للتقسيم
    }

    const combinedText = textParts.map((part: any) => part.text).join('\n\n');
    const textChunks = splitLongText(combinedText, maxTokens - 200); // احتياط أكبر للـ parts

    textChunks.forEach((chunk, index) => {
      const newContent = [
        ...nonTextParts,
        {
          type: 'text' as const,
          text: index === 0 ? chunk : `(الجزء ${index + 1})\n\n${chunk}`,
        },
      ];

      chunks.push({
        ...message,
        content: newContent as any,
      });
    });
  }

  return chunks;
}

/**
 * تقسيم مجموعة من الرسائل إلى chunks أصغر
 */
export function chunkMessages(
  messages: Omit<Message, 'id'>[],
  maxTokensPerChunk: number,
  systemPromptTokens: number = 1000,
): ChunkedMessage[] {
  const availableTokens = maxTokensPerChunk - systemPromptTokens;
  const totalTokens = calculateTotalTokens(messages);

  logger.info(`إجمالي الـ tokens: ${totalTokens}, الحد الأقصى المتاح: ${availableTokens}`);

  if (totalTokens <= availableTokens) {
    logger.info('الرسائل تدخل ضمن الحد المسموح، لا حاجة للتقسيم');
    return [
      {
        messages,
        isPartial: false,
        chunkIndex: 0,
        totalChunks: 1,
      },
    ];
  }

  logger.info('الرسائل تتجاوز الحد المسموح، سيتم التقسيم');

  const chunks: ChunkedMessage[] = [];
  let currentMessages: Omit<Message, 'id'>[] = [];
  let currentTokens = 0;

  for (const message of messages) {
    const messageTokens = calculateMessageTokens(message);

    // إذا كانت الرسالة الواحدة تتجاوز الحد المسموح، قسمها
    if (messageTokens > availableTokens) {
      // إضافة الرسائل المتراكمة كـ chunk منفصل
      if (currentMessages.length > 0) {
        chunks.push({
          messages: [...currentMessages],
          isPartial: true,
          chunkIndex: chunks.length,
          totalChunks: -1, // سيتم تحديثه لاحقاً
        });
        currentMessages = [];
        currentTokens = 0;
      }

      // تقسيم الرسالة الطويلة
      const messageChunks = chunkSingleMessage(message, availableTokens);

      for (const chunk of messageChunks) {
        chunks.push({
          messages: [chunk],
          isPartial: true,
          chunkIndex: chunks.length,
          totalChunks: -1,
        });
      }
    } else if (currentTokens + messageTokens > availableTokens) {
      // إضافة المجموعة الحالية كـ chunk
      if (currentMessages.length > 0) {
        chunks.push({
          messages: [...currentMessages],
          isPartial: true,
          chunkIndex: chunks.length,
          totalChunks: -1,
        });
      }

      // بدء مجموعة جديدة
      currentMessages = [message];
      currentTokens = messageTokens;
    } else {
      // إضافة الرسالة للمجموعة الحالية
      currentMessages.push(message);
      currentTokens += messageTokens;
    }
  }

  // إضافة المجموعة الأخيرة
  if (currentMessages.length > 0) {
    chunks.push({
      messages: [...currentMessages],
      isPartial: chunks.length > 0,
      chunkIndex: chunks.length,
      totalChunks: -1,
    });
  }

  // تحديث totalChunks لجميع الـ chunks
  const totalChunks = chunks.length;
  chunks.forEach((chunk) => {
    chunk.totalChunks = totalChunks;
  });

  logger.info(`تم تقسيم الرسائل إلى ${totalChunks} جزء`);

  return chunks;
}

/**
 * دمج نتائج الـ chunks المتعددة
 */
export function mergeChunkResults(results: string[]): string {
  if (results.length === 1) {
    return results[0];
  }

  const mergedResult = results
    .map((result, index) => {
      const prefix = index === 0 ? '' : `\n\n--- الجزء ${index + 1} ---\n\n`;
      return prefix + result;
    })
    .join('');

  return mergedResult;
}

/**
 * إنشاء ملخص للـ chunks السابقة لاستخدامه في الـ chunks التالية
 */
export function createChunkSummary(previousResults: string[]): string {
  if (previousResults.length === 0) {
    return '';
  }

  const summary = `ملخص الأجزاء السابقة:\n${previousResults
    .map((result, index) => `${index + 1}. ${result.substring(0, 200)}...`)
    .join('\n')}\n\n---\n\n`;

  return summary;
}
