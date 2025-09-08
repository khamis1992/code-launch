/**
 * Automatic Model Selection Service
 * Intelligently chooses the best AI model for each task
 */

import type { PromptAnalysis } from './smartPromptAnalyzer';

export interface ModelSelectionResult {
  selectedModel: string;
  provider: string;
  reason: string;
  confidence: number;
  fallbackModel?: string;
}

export class AutoModelSelector {
  
  // Model capabilities matrix
  private static MODEL_CAPABILITIES = {
    'claude-sonnet-4-20250514': {
      flutter: 0.95,
      complexity: 0.9,
      codeQuality: 0.95,
      debugging: 0.9,
      architecture: 0.95,
      cost: 0.6, // Higher cost
      speed: 0.7
    },
    'deepseek-v3': {
      flutter: 0.7,
      complexity: 0.8,
      codeQuality: 0.8,
      debugging: 0.75,
      architecture: 0.7,
      cost: 0.9, // Lower cost
      speed: 0.9
    },
    'deepseek-coder': {
      flutter: 0.75,
      complexity: 0.85,
      codeQuality: 0.85,
      debugging: 0.8,
      architecture: 0.75,
      cost: 0.85,
      speed: 0.85
    }
  };

  // Selection rules based on analysis
  private static SELECTION_RULES = [
    {
      condition: (analysis: PromptAnalysis) => 
        analysis.framework === 'flutter' && analysis.complexity === 'complex',
      model: 'claude-sonnet-4-20250514',
      reason: 'Flutter معقد يتطلب خبرة عالية - Claude 4-Sonnet هو الأفضل',
      confidence: 0.95
    },
    {
      condition: (analysis: PromptAnalysis) => 
        analysis.taskType === 'app-creation' && analysis.framework === 'flutter',
      model: 'claude-sonnet-4-20250514', 
      reason: 'إنشاء تطبيق Flutter جديد - Claude 4-Sonnet متخصص في Flutter',
      confidence: 0.9
    },
    {
      condition: (analysis: PromptAnalysis) => 
        analysis.taskType === 'documentation' || analysis.complexity === 'simple',
      model: 'deepseek-v3',
      reason: 'مهمة بسيطة أو توثيق - DeepSeek V3 سريع وفعال',
      confidence: 0.8
    },
    {
      condition: (analysis: PromptAnalysis) => 
        analysis.taskType === 'ui' && analysis.complexity === 'simple',
      model: 'deepseek-v3',
      reason: 'واجهة مستخدم بسيطة - DeepSeek V3 مناسب وأسرع',
      confidence: 0.75
    },
    {
      condition: (analysis: PromptAnalysis) => 
        analysis.language === 'ar' && analysis.framework === 'flutter',
      model: 'claude-sonnet-4-20250514',
      reason: 'محتوى عربي مع Flutter - Claude 4-Sonnet يدعم العربية بشكل أفضل',
      confidence: 0.85
    }
  ];

  /**
   * Main selection function
   */
  public static selectModel(analysis: PromptAnalysis): ModelSelectionResult {
    // Apply selection rules in order of priority
    for (const rule of this.SELECTION_RULES) {
      if (rule.condition(analysis)) {
        return {
          selectedModel: rule.model,
          provider: this.getProviderForModel(rule.model),
          reason: rule.reason,
          confidence: rule.confidence,
          fallbackModel: this.getFallbackModel(rule.model)
        };
      }
    }

    // Default fallback to Claude 4-Sonnet for quality assurance
    return {
      selectedModel: 'claude-sonnet-4-20250514',
      provider: 'Anthropic',
      reason: 'الاختيار الافتراضي لضمان أعلى جودة للكود',
      confidence: 0.8,
      fallbackModel: 'deepseek-v3'
    };
  }

  /**
   * Get provider name for model
   */
  private static getProviderForModel(model: string): string {
    if (model.includes('claude')) return 'Anthropic';
    if (model.includes('deepseek')) return 'Deepseek';
    return 'Unknown';
  }

  /**
   * Get fallback model
   */
  private static getFallbackModel(primaryModel: string): string {
    if (primaryModel.includes('claude')) return 'deepseek-v3';
    if (primaryModel.includes('deepseek')) return 'claude-sonnet-4-20250514';
    return 'claude-sonnet-4-20250514';
  }

  /**
   * Evaluate model performance for specific task
   */
  public static evaluateModelFit(model: string, analysis: PromptAnalysis): number {
    const capabilities = this.MODEL_CAPABILITIES[model as keyof typeof this.MODEL_CAPABILITIES];
    if (!capabilities) return 0.5;

    let score = 0;
    let factors = 0;

    // Framework fit
    if (analysis.framework === 'flutter') {
      score += capabilities.flutter * 0.3;
      factors += 0.3;
    }

    // Complexity handling
    if (analysis.complexity === 'complex') {
      score += capabilities.complexity * 0.25;
      factors += 0.25;
    }

    // Code quality importance
    if (analysis.taskType === 'app-creation') {
      score += capabilities.codeQuality * 0.25;
      factors += 0.25;
    }

    // Speed vs Quality trade-off
    if (analysis.complexity === 'simple') {
      score += capabilities.speed * 0.2;
      factors += 0.2;
    } else {
      score += capabilities.codeQuality * 0.2;
      factors += 0.2;
    }

    return factors > 0 ? score / factors : 0.5;
  }

  /**
   * Generate explanation for users
   */
  public static explainSelection(result: ModelSelectionResult, analysis: PromptAnalysis): string {
    const explanations = {
      'claude-sonnet-4-20250514': `
🏆 **تم اختيار Claude 4-Sonnet**

**لماذا هذا النموذج؟**
• متخصص في Flutter وDart
• جودة كود عالية جداً 
• يفهم المتطلبات المعقدة
• نتائج تعمل من أول مرة

**مناسب لـ:** التطبيقات المعقدة، Flutter، المشاريع المهمة
      `,
      'deepseek-v3': `
⚡ **تم اختيار DeepSeek V3**

**لماذا هذا النموذج؟**
• سريع في التنفيذ
• ممتاز للمهام البسيطة
• فعال من ناحية التكلفة
• جيد للتوثيق والشرح

**مناسب لـ:** المهام البسيطة، التوثيق، النماذج الأولية
      `
    };

    return explanations[result.selectedModel as keyof typeof explanations] || 
           'تم اختيار أفضل نموذج حسب نوع مهمتك';
  }

  /**
   * Smart model switching during conversation
   */
  public static shouldSwitchModel(
    currentModel: string, 
    newPrompt: string, 
    conversationHistory: string[]
  ): { shouldSwitch: boolean; newModel?: string; reason?: string } {
    const newAnalysis = require('./smartPromptAnalyzer').SmartPromptAnalyzer.analyzePrompt(newPrompt);
    const newSelection = this.selectModel(newAnalysis);

    // Don't switch if confidence is low
    if (newSelection.confidence < 0.7) {
      return { shouldSwitch: false };
    }

    // Don't switch if current model is appropriate
    if (currentModel === newSelection.selectedModel) {
      return { shouldSwitch: false };
    }

    // Switch if new model is significantly better
    const currentFit = this.evaluateModelFit(currentModel, newAnalysis);
    const newFit = this.evaluateModelFit(newSelection.selectedModel, newAnalysis);

    if (newFit - currentFit > 0.2) {
      return {
        shouldSwitch: true,
        newModel: newSelection.selectedModel,
        reason: `تم التبديل إلى ${newSelection.selectedModel} لتحسين جودة النتائج`
      };
    }

    return { shouldSwitch: false };
  }
}
