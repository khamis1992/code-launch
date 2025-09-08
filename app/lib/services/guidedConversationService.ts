/**
 * Guided Conversation Service for Non-Programmer Users
 * Automatically asks clarifying questions and builds apps step by step
 */

import { SmartPromptAnalyzer, type PromptAnalysis, type AppTypeDetection } from './smartPromptAnalyzer';
import { AutoModelSelector } from './autoModelSelector';

export interface ConversationStep {
  id: string;
  type: 'question' | 'info-gathering' | 'building' | 'preview' | 'completion';
  title: string;
  message: string;
  options?: string[];
  required: boolean;
  autoAdvance: boolean;
  estimatedTime?: string;
}

export interface ConversationState {
  currentStep: number;
  totalSteps: number;
  userResponses: Record<string, any>;
  appConfig: Record<string, any>;
  analysis: PromptAnalysis;
  appType?: AppTypeDetection;
  isComplete: boolean;
}

export class GuidedConversationService {
  
  /**
   * Initialize conversation from user prompt
   */
  public static initializeConversation(initialPrompt: string): {
    analysis: PromptAnalysis;
    firstStep: ConversationStep;
    totalSteps: number;
  } {
    const analysis = SmartPromptAnalyzer.analyzePrompt(initialPrompt);
    const appType = SmartPromptAnalyzer.detectAppType(initialPrompt);
    
    const steps = this.generateConversationSteps(analysis, appType);
    
    return {
      analysis,
      firstStep: steps[0],
      totalSteps: steps.length
    };
  }

  /**
   * Generate conversation steps based on analysis
   */
  private static generateConversationSteps(
    analysis: PromptAnalysis, 
    appType?: AppTypeDetection | null
  ): ConversationStep[] {
    const steps: ConversationStep[] = [];

    // Step 1: Confirmation and clarification
    if (appType) {
      steps.push({
        id: 'app-confirmation',
        type: 'question',
        title: 'تأكيد نوع التطبيق',
        message: `رائع! فهمت أنك تريد إنشاء تطبيق ${this.getAppTypeInArabic(appType.type)}. هل هذا صحيح؟`,
        options: ['نعم، هذا صحيح', 'لا، أريد شيئاً آخر'],
        required: true,
        autoAdvance: false
      });
    } else {
      steps.push({
        id: 'app-type-selection',
        type: 'question', 
        title: 'اختيار نوع التطبيق',
        message: 'ما نوع التطبيق الذي تريد إنشاءه؟',
        options: [
          '🍽️ تطبيق مطعم',
          '🛍️ متجر إلكتروني', 
          '🏥 تطبيق طبي',
          '🎓 تطبيق تعليمي',
          '💰 تطبيق مالي',
          '📱 تطبيق آخر'
        ],
        required: true,
        autoAdvance: false
      });
    }

    // Step 2: Basic info gathering
    steps.push({
      id: 'basic-info',
      type: 'info-gathering',
      title: 'المعلومات الأساسية',
      message: 'أحتاج بعض المعلومات الأساسية لبناء تطبيقك:',
      required: true,
      autoAdvance: false
    });

    // Step 3: Design preferences
    steps.push({
      id: 'design-preferences',
      type: 'question',
      title: 'تفضيلات التصميم',
      message: 'ما هي ألوانك المفضلة للتطبيق؟',
      options: [
        '🌿 أخضر وأزرق (طبيعي)',
        '🔥 أحمر وبرتقالي (نشيط)',
        '💜 بنفسجي وزهري (عصري)',
        '🌊 أزرق وأبيض (مهني)',
        '🎨 ألوان مخصصة'
      ],
      required: false,
      autoAdvance: true
    });

    // Step 4: Features selection
    if (appType) {
      steps.push({
        id: 'features-selection',
        type: 'question',
        title: 'الميزات المطلوبة',
        message: `ما هي الميزات التي تريدها في تطبيق ${this.getAppTypeInArabic(appType.type)}؟`,
        options: this.getFeaturesForAppType(appType.type),
        required: true,
        autoAdvance: false
      });
    }

    // Step 5: Building phase
    steps.push({
      id: 'building-phase',
      type: 'building',
      title: 'بناء التطبيق',
      message: 'ممتاز! الآن سأبدأ في بناء تطبيقك خطوة بخطوة...',
      required: false,
      autoAdvance: true,
      estimatedTime: '5-8 دقائق'
    });

    // Step 6: Preview and testing
    steps.push({
      id: 'preview-testing',
      type: 'preview',
      title: 'معاينة واختبار',
      message: 'تطبيقك جاهز! يمكنك الآن معاينته واختباره.',
      required: false,
      autoAdvance: false
    });

    // Step 7: Completion
    steps.push({
      id: 'completion',
      type: 'completion',
      title: 'اكتمال التطبيق',
      message: 'تهانينا! تطبيقك جاهز للنشر والاستخدام. 🎉',
      required: false,
      autoAdvance: false
    });

    return steps;
  }

  /**
   * Process user response and advance conversation
   */
  public static processResponse(
    currentStep: ConversationStep,
    userResponse: string,
    state: ConversationState
  ): {
    nextStep?: ConversationStep;
    updatedState: ConversationState;
    shouldBuild: boolean;
    buildInstructions?: string;
  } {
    const updatedState = { ...state };
    updatedState.userResponses[currentStep.id] = userResponse;

    // Process response based on step type
    switch (currentStep.id) {
      case 'app-confirmation':
        if (userResponse.includes('نعم')) {
          updatedState.currentStep++;
        } else {
          // Reset and ask for clarification
          return this.handleRejection(updatedState);
        }
        break;

      case 'app-type-selection':
        const selectedAppType = this.parseAppTypeSelection(userResponse);
        updatedState.appConfig.appType = selectedAppType;
        updatedState.currentStep++;
        break;

      case 'basic-info':
        updatedState.appConfig.basicInfo = this.parseBasicInfo(userResponse);
        updatedState.currentStep++;
        break;

      case 'design-preferences':
        updatedState.appConfig.colors = this.parseColorPreferences(userResponse);
        updatedState.currentStep++;
        break;

      case 'features-selection':
        updatedState.appConfig.features = this.parseFeatures(userResponse);
        updatedState.currentStep++;
        break;
    }

    // Check if we should start building
    const shouldBuild = currentStep.id === 'features-selection' || 
                       (currentStep.id === 'design-preferences' && !state.appType);

    let buildInstructions = '';
    if (shouldBuild) {
      buildInstructions = this.generateBuildInstructions(updatedState);
    }

    // Get next step
    const allSteps = this.generateConversationSteps(state.analysis, state.appType);
    const nextStep = allSteps[updatedState.currentStep];

    return {
      nextStep,
      updatedState,
      shouldBuild,
      buildInstructions
    };
  }

  /**
   * Generate build instructions from collected info
   */
  private static generateBuildInstructions(state: ConversationState): string {
    const { appConfig, analysis } = state;
    
    let instructions = `إنشاء تطبيق ${appConfig.appType || 'جديد'} باستخدام Flutter:\n\n`;
    
    // App details
    if (appConfig.basicInfo?.name) {
      instructions += `اسم التطبيق: ${appConfig.basicInfo.name}\n`;
    }
    
    if (appConfig.basicInfo?.description) {
      instructions += `وصف التطبيق: ${appConfig.basicInfo.description}\n`;
    }

    // Design
    if (appConfig.colors) {
      instructions += `الألوان: ${appConfig.colors}\n`;
    }

    // Features
    if (appConfig.features) {
      instructions += `الميزات المطلوبة: ${appConfig.features.join(', ')}\n`;
    }

    // Technical specs
    instructions += `\nالمتطلبات التقنية:
- استخدام Flutter مع Dart
- تصميم Material Design 3
- دعم الهواتف الذكية (Android & iOS)
- واجهة سهلة الاستخدام
- ألوان متناسقة ومريحة للعين
- أداء سريع ومستقر

يرجى إنشاء التطبيق خطوة بخطوة مع شرح كل خطوة للمستخدم غير المبرمج.`;

    return instructions;
  }

  /**
   * Helper functions for parsing responses
   */
  private static parseAppTypeSelection(response: string): string {
    if (response.includes('مطعم')) return 'restaurant';
    if (response.includes('متجر')) return 'ecommerce';
    if (response.includes('طبي')) return 'healthcare';
    if (response.includes('تعليمي')) return 'education';
    if (response.includes('مالي')) return 'fintech';
    return 'general';
  }

  private static parseBasicInfo(response: string): Record<string, string> {
    // Simple parsing - can be enhanced with NLP
    return {
      name: this.extractAppName(response),
      description: response
    };
  }

  private static parseColorPreferences(response: string): string {
    if (response.includes('أخضر')) return 'green-blue';
    if (response.includes('أحمر')) return 'red-orange';
    if (response.includes('بنفسجي')) return 'purple-pink';
    if (response.includes('أزرق')) return 'blue-white';
    return 'custom';
  }

  private static parseFeatures(response: string): string[] {
    const features: string[] = [];
    
    if (response.includes('دفع') || response.includes('payment')) features.push('payments');
    if (response.includes('توصيل') || response.includes('delivery')) features.push('delivery');
    if (response.includes('تسجيل') || response.includes('login')) features.push('authentication');
    if (response.includes('إشعارات') || response.includes('notifications')) features.push('notifications');
    
    return features;
  }

  private static extractAppName(text: string): string {
    // Simple name extraction - can be enhanced
    const patterns = [
      /اسم[ه]?\s+(.+)/,
      /يسمى\s+(.+)/,
      /تطبيق\s+(.+)/,
      /app\s+(.+)/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim().split(/\s+/).slice(0, 3).join(' '); // Max 3 words
      }
    }

    return 'تطبيقي الجديد';
  }

  private static getAppTypeInArabic(appType: string): string {
    const translations = {
      'restaurant': 'مطعم',
      'ecommerce': 'متجر إلكتروني',
      'healthcare': 'طبي',
      'education': 'تعليمي', 
      'fintech': 'مالي',
      'delivery': 'توصيل',
      'social': 'تواصل اجتماعي'
    };
    
    return translations[appType as keyof typeof translations] || appType;
  }

  private static getFeaturesForAppType(appType: string): string[] {
    const features = {
      'restaurant': [
        '📋 قائمة الطعام',
        '🛒 نظام الطلبات', 
        '🚚 خدمة التوصيل',
        '💳 الدفع الإلكتروني',
        '⭐ تقييم المطعم',
        '📍 العنوان والخريطة'
      ],
      'ecommerce': [
        '📦 عرض المنتجات',
        '🛒 سلة التسوق',
        '💳 الدفع الآمن',
        '📊 إدارة المخزون',
        '🚚 تتبع الطلبات',
        '⭐ تقييم المنتجات'
      ],
      'healthcare': [
        '📅 حجز المواعيد',
        '👥 ملفات المرضى',
        '💊 الوصفات الطبية',
        '📊 التقارير الطبية',
        '🔔 تذكير المواعيد',
        '📞 التواصل مع الطبيب'
      ]
    };

    return features[appType as keyof typeof features] || [
      '📱 الشاشة الرئيسية',
      '👤 ملف المستخدم', 
      '⚙️ الإعدادات',
      '📞 التواصل'
    ];
  }

  private static handleRejection(state: ConversationState) {
    // Return to app type selection
    const clarificationStep: ConversationStep = {
      id: 'clarification',
      type: 'question',
      title: 'توضيح المطلوب',
      message: 'لا بأس! دعني أفهم بشكل أفضل. ما نوع التطبيق الذي تريد إنشاءه بالضبط؟',
      options: [
        '🍽️ تطبيق مطعم أو مقهى',
        '🛍️ متجر لبيع المنتجات',
        '🏥 تطبيق طبي أو صحي',
        '🎓 تطبيق تعليمي',
        '💰 تطبيق مالي أو محفظة',
        '📱 شيء آخر (سأوضح)'
      ],
      required: true,
      autoAdvance: false
    };

    return {
      nextStep: clarificationStep,
      updatedState: { ...state, currentStep: 0 },
      shouldBuild: false
    };
  }

  /**
   * Generate contextual help messages
   */
  public static generateHelpMessage(step: ConversationStep, appType?: string): string {
    const helpMessages = {
      'app-confirmation': 'إذا لم أفهم مطلبك بشكل صحيح، اختر "لا" وسأساعدك في توضيح ما تريده.',
      'basic-info': 'مثال: "اسم التطبيق: مطعم الأصالة، يقدم الطعام العربي التقليدي"',
      'design-preferences': 'اختر الألوان التي تناسب طبيعة تطبيقك ومستخدميك.',
      'features-selection': 'اختر الميزات الأساسية فقط. يمكن إضافة المزيد لاحقاً.'
    };

    return helpMessages[step.id as keyof typeof helpMessages] || 
           'أجب بوضوح وبساطة. سأفهم ما تحتاجه وأساعدك في بنائه.';
  }

  /**
   * Generate progress message
   */
  public static generateProgressMessage(state: ConversationState): string {
    const progress = Math.round((state.currentStep / state.totalSteps) * 100);
    
    const progressMessages = [
      `جاري جمع المعلومات... ${progress}%`,
      `فهم متطلباتك... ${progress}%`, 
      `تحضير التصميم... ${progress}%`,
      `بناء التطبيق... ${progress}%`,
      `اختبار الوظائف... ${progress}%`,
      `التطبيق جاهز! ${progress}%`
    ];

    const messageIndex = Math.min(
      Math.floor(state.currentStep / state.totalSteps * progressMessages.length),
      progressMessages.length - 1
    );

    return progressMessages[messageIndex];
  }

  /**
   * Check if conversation is complete
   */
  public static isConversationComplete(state: ConversationState): boolean {
    return state.currentStep >= state.totalSteps - 1 && 
           Object.keys(state.userResponses).length >= 3; // Minimum required responses
  }

  /**
   * Generate final summary for user
   */
  public static generateCompletionSummary(state: ConversationState): string {
    const { appConfig } = state;
    
    return `
🎉 **تم إنشاء تطبيقك بنجاح!**

**📱 تفاصيل التطبيق:**
• الاسم: ${appConfig.basicInfo?.name || 'تطبيقك الجديد'}
• النوع: ${this.getAppTypeInArabic(appConfig.appType)}
• الألوان: ${appConfig.colors || 'الألوان الافتراضية'}

**✅ الميزات المضافة:**
${appConfig.features?.map((f: string) => `• ${f}`).join('\n') || '• الميزات الأساسية'}

**🚀 الخطوات التالية:**
1. اختبر التطبيق في المعاينة
2. اطلب تعديلات إذا لزم الأمر
3. انشر التطبيق عندما تكون راضياً عنه

**💡 نصيحة:** يمكنك دائماً طلب إضافة ميزات جديدة أو تعديل التصميم!
    `;
  }
}
