/**
 * Smart Prompt Analyzer for Non-Programmer Users
 * Automatically detects task type, complexity, and framework
 */

export interface PromptAnalysis {
  language: 'ar' | 'en';
  complexity: 'simple' | 'medium' | 'complex';
  taskType: 'ui' | 'logic' | 'integration' | 'documentation' | 'app-creation';
  framework: 'flutter' | 'web' | 'general';
  appType?: string;
  suggestedModel: string;
  confidence: number;
}

export interface AppTypeDetection {
  type: string;
  template: string;
  confidence: number;
  features: string[];
}

export class SmartPromptAnalyzer {
  
  // App type patterns for Arabic and English
  private static APP_TYPE_PATTERNS = {
    'مطعم|restaurant|food|cafe|قهوة|طعام': {
      type: 'restaurant',
      template: 'restaurant-template',
      features: ['menu', 'orders', 'delivery', 'payments']
    },
    'متجر|shop|store|ecommerce|تسوق|بيع': {
      type: 'ecommerce', 
      template: 'ecommerce-template',
      features: ['products', 'cart', 'checkout', 'inventory']
    },
    'عيادة|clinic|hospital|طبي|صحة|health': {
      type: 'healthcare',
      template: 'healthcare-template', 
      features: ['appointments', 'patients', 'medical-records']
    },
    'مدرسة|school|education|تعليم|جامعة|university': {
      type: 'education',
      template: 'education-template',
      features: ['students', 'courses', 'grades', 'attendance']
    },
    'بنك|bank|مالي|finance|محفظة|wallet': {
      type: 'fintech',
      template: 'fintech-template',
      features: ['accounts', 'transactions', 'transfers', 'cards']
    },
    'توصيل|delivery|شحن|logistics|نقل': {
      type: 'delivery',
      template: 'delivery-template', 
      features: ['tracking', 'drivers', 'orders', 'routes']
    },
    'تواصل|chat|social|اجتماعي|رسائل|messages': {
      type: 'social',
      template: 'social-template',
      features: ['messaging', 'posts', 'friends', 'notifications']
    }
  };

  // Complexity indicators
  private static COMPLEXITY_PATTERNS = {
    simple: [
      'بسيط', 'simple', 'basic', 'صفحة واحدة', 'single page',
      'عرض فقط', 'display only', 'قراءة', 'read only'
    ],
    medium: [
      'تطبيق', 'app', 'نظام', 'system', 'متعدد الصفحات', 'multiple pages',
      'تسجيل دخول', 'login', 'قاعدة بيانات', 'database'
    ],
    complex: [
      'معقد', 'complex', 'متقدم', 'advanced', 'ذكي', 'smart', 'ai',
      'تكامل', 'integration', 'api', 'مدفوعات', 'payments', 'تحليلات', 'analytics'
    ]
  };

  // Task type patterns
  private static TASK_TYPE_PATTERNS = {
    'app-creation': [
      'أريد تطبيق', 'create app', 'build app', 'انشئ تطبيق', 'اعمل تطبيق',
      'تطبيق جديد', 'new app', 'تطوير تطبيق', 'develop app'
    ],
    'ui': [
      'واجهة', 'interface', 'تصميم', 'design', 'شاشة', 'screen',
      'صفحة', 'page', 'layout', 'ui', 'ux'
    ],
    'logic': [
      'وظيفة', 'function', 'منطق', 'logic', 'خوارزمية', 'algorithm',
      'معالجة', 'processing', 'حسابات', 'calculations'
    ],
    'integration': [
      'ربط', 'connect', 'تكامل', 'integration', 'api', 'قاعدة بيانات', 'database',
      'خدمة', 'service', 'backend'
    ],
    'documentation': [
      'شرح', 'explain', 'وضح', 'clarify', 'كيف', 'how', 'ماذا', 'what',
      'documentation', 'guide', 'tutorial'
    ]
  };

  // Framework detection
  private static FRAMEWORK_PATTERNS = {
    flutter: [
      'flutter', 'dart', 'موبايل', 'mobile', 'android', 'ios',
      'تطبيق جوال', 'mobile app', 'هاتف', 'phone'
    ],
    web: [
      'موقع', 'website', 'web', 'html', 'css', 'javascript', 'react',
      'متصفح', 'browser', 'إنترنت', 'internet'
    ]
  };

  /**
   * Main analysis function
   */
  public static analyzePrompt(prompt: string): PromptAnalysis {
    const language = this.detectLanguage(prompt);
    const complexity = this.detectComplexity(prompt);
    const taskType = this.detectTaskType(prompt);
    const framework = this.detectFramework(prompt);
    const appType = this.detectAppType(prompt);
    
    const suggestedModel = this.selectOptimalModel({
      complexity,
      taskType,
      framework,
      appType: appType?.type
    });

    const confidence = this.calculateConfidence(prompt, {
      language,
      complexity, 
      taskType,
      framework,
      appType: appType?.type
    });

    return {
      language,
      complexity,
      taskType,
      framework,
      appType: appType?.type,
      suggestedModel,
      confidence
    };
  }

  /**
   * Detect app type from prompt
   */
  public static detectAppType(prompt: string): AppTypeDetection | null {
    const lowerPrompt = prompt.toLowerCase();
    
    for (const [pattern, config] of Object.entries(this.APP_TYPE_PATTERNS)) {
      const keywords = pattern.split('|');
      const matches = keywords.filter(keyword => lowerPrompt.includes(keyword));
      
      if (matches.length > 0) {
        return {
          type: config.type,
          template: config.template,
          confidence: matches.length / keywords.length,
          features: config.features
        };
      }
    }
    
    return null;
  }

  /**
   * Detect language (Arabic vs English)
   */
  private static detectLanguage(prompt: string): 'ar' | 'en' {
    const arabicChars = prompt.match(/[\u0600-\u06FF]/g);
    const arabicRatio = arabicChars ? arabicChars.length / prompt.length : 0;
    return arabicRatio > 0.3 ? 'ar' : 'en';
  }

  /**
   * Detect complexity level
   */
  private static detectComplexity(prompt: string): 'simple' | 'medium' | 'complex' {
    const lowerPrompt = prompt.toLowerCase();
    
    // Count complexity indicators
    const simpleCount = this.COMPLEXITY_PATTERNS.simple
      .filter(pattern => lowerPrompt.includes(pattern)).length;
    const mediumCount = this.COMPLEXITY_PATTERNS.medium
      .filter(pattern => lowerPrompt.includes(pattern)).length;
    const complexCount = this.COMPLEXITY_PATTERNS.complex
      .filter(pattern => lowerPrompt.includes(pattern)).length;

    if (complexCount > 0) return 'complex';
    if (mediumCount > 0) return 'medium';
    if (simpleCount > 0) return 'simple';
    
    // Default based on prompt length and detail
    if (prompt.length > 200) return 'complex';
    if (prompt.length > 50) return 'medium';
    return 'simple';
  }

  /**
   * Detect task type
   */
  private static detectTaskType(prompt: string): 'ui' | 'logic' | 'integration' | 'documentation' | 'app-creation' {
    const lowerPrompt = prompt.toLowerCase();
    
    for (const [taskType, patterns] of Object.entries(this.TASK_TYPE_PATTERNS)) {
      const matches = patterns.filter(pattern => lowerPrompt.includes(pattern));
      if (matches.length > 0) {
        return taskType as any;
      }
    }
    
    return 'app-creation'; // Default for non-programmers
  }

  /**
   * Detect framework preference
   */
  private static detectFramework(prompt: string): 'flutter' | 'web' | 'general' {
    const lowerPrompt = prompt.toLowerCase();
    
    for (const [framework, patterns] of Object.entries(this.FRAMEWORK_PATTERNS)) {
      const matches = patterns.filter(pattern => lowerPrompt.includes(pattern));
      if (matches.length > 0) {
        return framework as any;
      }
    }
    
    return 'flutter'; // Default for CodeLaunch (Flutter-focused platform)
  }

  /**
   * Select optimal model based on analysis
   */
  private static selectOptimalModel(analysis: {
    complexity: string;
    taskType: string;
    framework: string;
    appType?: string;
  }): string {
    const { complexity, taskType, framework, appType } = analysis;

    // Rules for model selection
    if (framework === 'flutter' && (complexity === 'complex' || complexity === 'medium')) {
      return 'claude-sonnet-4-20250514'; // Best for Flutter
    }

    if (taskType === 'documentation' || taskType === 'ui' && complexity === 'simple') {
      return 'deepseek-v3'; // Good for simple tasks
    }

    if (taskType === 'integration' || complexity === 'complex') {
      return 'claude-sonnet-4-20250514'; // Best for complex logic
    }

    // Default: Claude 4-Sonnet for quality assurance
    return 'claude-sonnet-4-20250514';
  }

  /**
   * Calculate confidence score
   */
  private static calculateConfidence(prompt: string, analysis: any): number {
    let confidence = 0.5; // Base confidence
    
    // Higher confidence for longer, detailed prompts
    if (prompt.length > 100) confidence += 0.2;
    if (prompt.length > 200) confidence += 0.1;
    
    // Higher confidence for specific keywords
    const specificKeywords = ['تطبيق', 'app', 'flutter', 'موبايل', 'mobile'];
    const keywordMatches = specificKeywords.filter(keyword => 
      prompt.toLowerCase().includes(keyword)
    ).length;
    confidence += keywordMatches * 0.1;
    
    return Math.min(confidence, 1.0);
  }

  /**
   * Generate guided questions based on analysis
   */
  public static generateGuidedQuestions(analysis: PromptAnalysis): string[] {
    const questions: string[] = [];
    
    if (analysis.appType) {
      switch (analysis.appType) {
        case 'restaurant':
          questions.push(
            'ما اسم مطعمك؟',
            'ما نوع الطعام؟ (عربي، إيطالي، سريع)',
            'هل تريد خدمة توصيل؟',
            'ما هي الألوان المفضلة للتطبيق؟'
          );
          break;
        case 'ecommerce':
          questions.push(
            'ما اسم متجرك؟',
            'ما نوع المنتجات التي تبيعها؟',
            'هل تحتاج نظام دفع؟',
            'كم عدد الفئات المتوقع؟'
          );
          break;
        case 'healthcare':
          questions.push(
            'ما اسم العيادة أو المستشفى؟',
            'ما نوع التخصص الطبي؟',
            'هل تحتاج نظام مواعيد؟',
            'هل تريد ملفات طبية للمرضى؟'
          );
          break;
        default:
          questions.push(
            'ما اسم التطبيق؟',
            'من هم المستخدمون المستهدفون؟',
            'ما هي الوظائف الأساسية المطلوبة؟'
          );
      }
    } else {
      // Generic questions for unclear prompts
      questions.push(
        'ما نوع التطبيق الذي تريد إنشاءه؟',
        'هل هو تطبيق جوال أم موقع ويب؟',
        'ما هي الوظائف الأساسية المطلوبة؟'
      );
    }
    
    return questions;
  }

  /**
   * Generate auto-completion suggestions
   */
  public static generateAutoCompletions(analysis: PromptAnalysis): Record<string, any> {
    const defaults: Record<string, any> = {
      colors: {
        primary: '#98FF98',   // Mint Green
        secondary: '#1E3A8A', // Marine Navy
        accent: '#F5F5DC',    // Light Sand Beige
        background: '#0B1020' // Deep Space
      },
      navigation: 'bottom-tabs',
      authentication: false,
      database: 'supabase'
    };

    // App-specific defaults
    if (analysis.appType === 'restaurant') {
      defaults.features = ['menu', 'orders', 'delivery'];
      defaults.colors.primary = '#FF6B35'; // Food orange
      defaults.authentication = true;
    } else if (analysis.appType === 'ecommerce') {
      defaults.features = ['products', 'cart', 'payments'];
      defaults.colors.primary = '#4F46E5'; // Commerce purple
      defaults.authentication = true;
    } else if (analysis.appType === 'healthcare') {
      defaults.features = ['appointments', 'records'];
      defaults.colors.primary = '#10B981'; // Health green
      defaults.authentication = true;
    }

    return defaults;
  }

  /**
   * Generate step-by-step plan
   */
  public static generateStepPlan(analysis: PromptAnalysis, appType?: AppTypeDetection): Array<{
    step: number;
    title: string;
    description: string;
    auto: boolean;
    needsInput: boolean;
    estimatedTime: string;
  }> {
    const basePlan = [
      {
        step: 1,
        title: 'إعداد المشروع',
        description: 'إنشاء هيكل المشروع الأساسي وإعداد التبعيات',
        auto: true,
        needsInput: false,
        estimatedTime: '1 دقيقة'
      },
      {
        step: 2, 
        title: 'تصميم الواجهات',
        description: 'إنشاء الشاشات الأساسية وتطبيق التصميم',
        auto: true,
        needsInput: false,
        estimatedTime: '3 دقائق'
      }
    ];

    if (appType) {
      // Add app-specific steps
      if (appType.features.includes('authentication')) {
        basePlan.push({
          step: 3,
          title: 'نظام تسجيل الدخول',
          description: 'إضافة تسجيل دخول آمن للمستخدمين',
          auto: false,
          needsInput: true,
          estimatedTime: '2 دقيقة'
        });
      }

      if (appType.features.includes('database')) {
        basePlan.push({
          step: 4,
          title: 'قاعدة البيانات',
          description: 'ربط التطبيق بقاعدة البيانات',
          auto: false,
          needsInput: true,
          estimatedTime: '2 دقيقة'
        });
      }
    }

    // Final steps
    basePlan.push(
      {
        step: basePlan.length + 1,
        title: 'اختبار التطبيق',
        description: 'فحص جميع الوظائف والتأكد من عملها',
        auto: true,
        needsInput: false,
        estimatedTime: '1 دقيقة'
      },
      {
        step: basePlan.length + 2,
        title: 'نشر التطبيق',
        description: 'رفع التطبيق وجعله متاحاً للاستخدام',
        auto: false,
        needsInput: true,
        estimatedTime: '3 دقائق'
      }
    );

    return basePlan;
  }
}
