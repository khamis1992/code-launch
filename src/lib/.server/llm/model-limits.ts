/**
 * حدود الـ tokens الفعلية لكل نموذج
 * يتم تحديث هذه القيم بناءً على الوثائق الرسمية لكل نموذج
 */

export interface ModelTokenLimits {
  /** اسم النموذج */
  modelName: string;

  /** الحد الأقصى لعدد tokens في السياق (input) */
  maxContextTokens: number;

  /** الحد الأقصى لعدد tokens في الاستجابة (output) */
  maxCompletionTokens: number;

  /** مقدم الخدمة */
  provider: string;

  /** تاريخ آخر تحديث للحدود */
  lastUpdated: string;

  /** ملاحظات إضافية */
  notes?: string;
}

/**
 * قاعدة بيانات حدود الـ tokens لجميع النماذج المدعومة
 */
export const MODEL_TOKEN_LIMITS: ModelTokenLimits[] = [
  // Anthropic Claude Models
  {
    modelName: 'claude-3-5-sonnet-20241022',
    maxContextTokens: 200000,
    maxCompletionTokens: 8192, // الحد الأقصى الفعلي المؤكد
    provider: 'Anthropic',
    lastUpdated: '2024-12-21',
    notes: 'هذا هو الحد الأقصى الفعلي للإخراج، وليس 128000 كما هو مذكور في بعض المصادر',
  },
  {
    modelName: 'claude-3-haiku-20240307',
    maxContextTokens: 200000,
    maxCompletionTokens: 4096,
    provider: 'Anthropic',
    lastUpdated: '2024-12-21',
  },
  {
    modelName: 'claude-3-opus-20240229',
    maxContextTokens: 200000,
    maxCompletionTokens: 4096,
    provider: 'Anthropic',
    lastUpdated: '2024-12-21',
  },
  {
    modelName: 'claude-opus-4-20250514',
    maxContextTokens: 200000,
    maxCompletionTokens: 32000,
    provider: 'Anthropic',
    lastUpdated: '2024-12-21',
  },

  // OpenAI GPT Models
  {
    modelName: 'gpt-4o',
    maxContextTokens: 128000,
    maxCompletionTokens: 16384,
    provider: 'OpenAI',
    lastUpdated: '2024-12-21',
  },
  {
    modelName: 'gpt-4o-mini',
    maxContextTokens: 128000,
    maxCompletionTokens: 16384,
    provider: 'OpenAI',
    lastUpdated: '2024-12-21',
  },
  {
    modelName: 'gpt-4-turbo',
    maxContextTokens: 128000,
    maxCompletionTokens: 4096,
    provider: 'OpenAI',
    lastUpdated: '2024-12-21',
  },
  {
    modelName: 'gpt-3.5-turbo',
    maxContextTokens: 16385,
    maxCompletionTokens: 4096,
    provider: 'OpenAI',
    lastUpdated: '2024-12-21',
  },

  // Google Gemini Models
  {
    modelName: 'gemini-1.5-pro',
    maxContextTokens: 2097152,
    maxCompletionTokens: 8192,
    provider: 'Google',
    lastUpdated: '2024-12-21',
  },
  {
    modelName: 'gemini-1.5-flash',
    maxContextTokens: 1048576,
    maxCompletionTokens: 8192,
    provider: 'Google',
    lastUpdated: '2024-12-21',
  },
  {
    modelName: 'gemini-2.0-flash',
    maxContextTokens: 1048576,
    maxCompletionTokens: 8192,
    provider: 'Google',
    lastUpdated: '2024-12-21',
  },

  // Reasoning Models (تحتاج معاملة خاصة)
  {
    modelName: 'o1-preview',
    maxContextTokens: 128000,
    maxCompletionTokens: 32768,
    provider: 'OpenAI',
    lastUpdated: '2024-12-21',
    notes: 'نموذج تفكير - يستخدم maxCompletionTokens بدلاً من maxTokens',
  },
  {
    modelName: 'o1-mini',
    maxContextTokens: 128000,
    maxCompletionTokens: 65536,
    provider: 'OpenAI',
    lastUpdated: '2024-12-21',
    notes: 'نموذج تفكير - يستخدم maxCompletionTokens بدلاً من maxTokens',
  },
];

/**
 * البحث عن حدود نموذج معين
 */
export function getModelLimits(modelName: string): ModelTokenLimits | null {
  const exactMatch = MODEL_TOKEN_LIMITS.find((limit) => limit.modelName === modelName);

  if (exactMatch) {
    return exactMatch;
  }

  // البحث الجزئي للنماذج المتشابهة
  const partialMatch = MODEL_TOKEN_LIMITS.find(
    (limit) =>
      modelName.toLowerCase().includes(limit.modelName.toLowerCase()) ||
      limit.modelName.toLowerCase().includes(modelName.toLowerCase()),
  );

  return partialMatch || null;
}

/**
 * الحصول على حدود النموذج مع القيم الافتراضية
 */
export function getModelLimitsWithDefaults(
  modelName: string,
  provider: string,
): { maxContextTokens: number; maxCompletionTokens: number } {
  const limits = getModelLimits(modelName);

  if (limits) {
    return {
      maxContextTokens: limits.maxContextTokens,
      maxCompletionTokens: limits.maxCompletionTokens,
    };
  }

  // القيم الافتراضية حسب المقدم
  const defaultLimits: Record<string, { maxContextTokens: number; maxCompletionTokens: number }> = {
    Anthropic: { maxContextTokens: 200000, maxCompletionTokens: 8192 },
    OpenAI: { maxContextTokens: 128000, maxCompletionTokens: 4096 },
    Google: { maxContextTokens: 1048576, maxCompletionTokens: 8192 },
    Cohere: { maxContextTokens: 128000, maxCompletionTokens: 4000 },
    DeepSeek: { maxContextTokens: 128000, maxCompletionTokens: 8192 },
    Groq: { maxContextTokens: 32768, maxCompletionTokens: 8192 },
    HuggingFace: { maxContextTokens: 32768, maxCompletionTokens: 4096 },
    Mistral: { maxContextTokens: 128000, maxCompletionTokens: 8192 },
    Ollama: { maxContextTokens: 32768, maxCompletionTokens: 8192 },
    OpenRouter: { maxContextTokens: 128000, maxCompletionTokens: 8192 },
    Perplexity: { maxContextTokens: 128000, maxCompletionTokens: 8192 },
    Together: { maxContextTokens: 128000, maxCompletionTokens: 8192 },
    xAI: { maxContextTokens: 128000, maxCompletionTokens: 8192 },
    LMStudio: { maxContextTokens: 32768, maxCompletionTokens: 8192 },
    OpenAILike: { maxContextTokens: 128000, maxCompletionTokens: 8192 },
    AmazonBedrock: { maxContextTokens: 200000, maxCompletionTokens: 8192 },
    Hyperbolic: { maxContextTokens: 128000, maxCompletionTokens: 8192 },
  };

  return defaultLimits[provider] || { maxContextTokens: 32768, maxCompletionTokens: 4096 };
}

/**
 * التحقق من صحة حدود الـ tokens المطلوبة
 */
export function validateTokenRequest(
  modelName: string,
  provider: string,
  requestedTokens: number,
): { valid: boolean; actualLimit: number; error?: string } {
  const limits = getModelLimitsWithDefaults(modelName, provider);

  if (requestedTokens <= limits.maxCompletionTokens) {
    return { valid: true, actualLimit: limits.maxCompletionTokens };
  }

  return {
    valid: false,
    actualLimit: limits.maxCompletionTokens,
    error: `المطلوب: ${requestedTokens} tokens، الحد الأقصى للنموذج ${modelName}: ${limits.maxCompletionTokens} tokens`,
  };
}

/**
 * حساب عدد الـ chunks المطلوبة بناءً على حجم الرسالة
 */
export function calculateRequiredChunks(
  totalTokens: number,
  modelName: string,
  provider: string,
  systemPromptTokens: number = 1000,
): { chunksNeeded: number; tokensPerChunk: number } {
  const limits = getModelLimitsWithDefaults(modelName, provider);
  const availableTokensPerChunk = limits.maxCompletionTokens - systemPromptTokens;

  if (totalTokens <= availableTokensPerChunk) {
    return { chunksNeeded: 1, tokensPerChunk: totalTokens };
  }

  const chunksNeeded = Math.ceil(totalTokens / availableTokensPerChunk);

  return { chunksNeeded, tokensPerChunk: availableTokensPerChunk };
}

/**
 * إنشاء تقرير عن حدود النموذج
 */
export function generateModelLimitsReport(modelName: string, provider: string): string {
  const limits = getModelLimits(modelName);

  if (!limits) {
    const defaults = getModelLimitsWithDefaults(modelName, provider);
    return `النموذج ${modelName} غير موجود في قاعدة البيانات. يتم استخدام القيم الافتراضية:
- الحد الأقصى للسياق: ${defaults.maxContextTokens.toLocaleString()} token
- الحد الأقصى للاستجابة: ${defaults.maxCompletionTokens.toLocaleString()} token`;
  }

  return `تقرير حدود النموذج ${modelName}:
- مقدم الخدمة: ${limits.provider}
- الحد الأقصى للسياق: ${limits.maxContextTokens.toLocaleString()} token
- الحد الأقصى للاستجابة: ${limits.maxCompletionTokens.toLocaleString()} token
- آخر تحديث: ${limits.lastUpdated}
${limits.notes ? `- ملاحظات: ${limits.notes}` : ''}`;
}
