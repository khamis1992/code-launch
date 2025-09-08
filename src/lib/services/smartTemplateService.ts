/**
 * Smart Template Service for Non-Programmer Users
 * Provides intelligent app templates based on user needs
 */

export interface SmartTemplate {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  category: string;
  complexity: 'simple' | 'medium' | 'complex';
  estimatedTime: string;
  features: string[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  screens: string[];
  setupQuestions: string[];
}

export class SmartTemplateService {
  
  private static SMART_TEMPLATES: SmartTemplate[] = [
    {
      id: 'restaurant-smart',
      name: 'Restaurant App',
      nameAr: 'تطبيق مطعم',
      description: 'Complete restaurant app with menu, orders, and delivery',
      descriptionAr: 'تطبيق مطعم متكامل مع القائمة والطلبات والتوصيل',
      icon: '🍽️',
      category: 'business',
      complexity: 'medium',
      estimatedTime: '5-7 دقائق',
      features: ['menu-display', 'order-system', 'delivery-tracking', 'payment-integration'],
      colors: {
        primary: '#FF6B35', // Food orange
        secondary: '#2C3E50', // Dark blue
        accent: '#F39C12'   // Golden yellow
      },
      screens: ['home', 'menu', 'cart', 'checkout', 'orders', 'profile'],
      setupQuestions: [
        'ما اسم مطعمك؟',
        'ما نوع الطعام الذي تقدمه؟',
        'هل تقدم خدمة التوصيل؟',
        'ما هي ساعات العمل؟'
      ]
    },
    {
      id: 'ecommerce-smart',
      name: 'E-Commerce Store',
      nameAr: 'متجر إلكتروني',
      description: 'Modern online store with products, cart, and secure payments',
      descriptionAr: 'متجر إلكتروني حديث مع المنتجات وسلة التسوق والدفع الآمن',
      icon: '🛍️',
      category: 'business',
      complexity: 'medium',
      estimatedTime: '6-8 دقائق',
      features: ['product-catalog', 'shopping-cart', 'payment-gateway', 'order-management'],
      colors: {
        primary: '#4F46E5', // Commerce purple
        secondary: '#1F2937', // Dark gray
        accent: '#10B981'   // Success green
      },
      screens: ['home', 'products', 'product-detail', 'cart', 'checkout', 'orders'],
      setupQuestions: [
        'ما اسم متجرك؟',
        'ما نوع المنتجات التي تبيعها؟',
        'كم عدد المنتجات المتوقع؟',
        'هل تحتاج نظام دفع؟'
      ]
    },
    {
      id: 'healthcare-smart',
      name: 'Healthcare App',
      nameAr: 'تطبيق طبي',
      description: 'Medical app for appointments, patient records, and consultations',
      descriptionAr: 'تطبيق طبي للمواعيد وملفات المرضى والاستشارات',
      icon: '🏥',
      category: 'healthcare',
      complexity: 'complex',
      estimatedTime: '8-10 دقائق',
      features: ['appointment-booking', 'patient-records', 'prescription-management', 'telemedicine'],
      colors: {
        primary: '#10B981', // Medical green
        secondary: '#374151', // Professional gray
        accent: '#3B82F6'   // Trust blue
      },
      screens: ['home', 'appointments', 'patients', 'prescriptions', 'reports'],
      setupQuestions: [
        'ما اسم العيادة أو المستشفى؟',
        'ما التخصص الطبي؟',
        'كم عدد الأطباء؟',
        'هل تحتاج ملفات إلكترونية للمرضى؟'
      ]
    },
    {
      id: 'education-smart',
      name: 'Education Platform',
      nameAr: 'منصة تعليمية',
      description: 'Learning platform with courses, students, and progress tracking',
      descriptionAr: 'منصة تعليمية مع الدورات والطلاب ومتابعة التقدم',
      icon: '🎓',
      category: 'education',
      complexity: 'medium',
      estimatedTime: '6-8 دقائق',
      features: ['course-management', 'student-portal', 'progress-tracking', 'assignments'],
      colors: {
        primary: '#8B5CF6', // Education purple
        secondary: '#1F2937', // Dark text
        accent: '#F59E0B'   // Achievement gold
      },
      screens: ['home', 'courses', 'course-detail', 'assignments', 'progress', 'profile'],
      setupQuestions: [
        'ما اسم المؤسسة التعليمية؟',
        'ما نوع الدورات المقدمة؟',
        'كم عدد الطلاب المتوقع؟',
        'هل تحتاج نظام اختبارات؟'
      ]
    },
    {
      id: 'fintech-smart',
      name: 'Financial App',
      nameAr: 'تطبيق مالي',
      description: 'Secure financial app with accounts, transactions, and transfers',
      descriptionAr: 'تطبيق مالي آمن مع الحسابات والمعاملات والتحويلات',
      icon: '💰',
      category: 'finance',
      complexity: 'complex',
      estimatedTime: '8-12 دقيقة',
      features: ['account-management', 'transaction-history', 'money-transfer', 'security'],
      colors: {
        primary: '#059669', // Financial green
        secondary: '#1F2937', // Professional dark
        accent: '#3B82F6'   // Trust blue
      },
      screens: ['home', 'accounts', 'transactions', 'transfer', 'security', 'settings'],
      setupQuestions: [
        'ما اسم الخدمة المالية؟',
        'ما نوع الخدمات المالية؟',
        'هل تحتاج تحويلات؟',
        'ما مستوى الأمان المطلوب؟'
      ]
    },
    {
      id: 'simple-display',
      name: 'Simple Display App',
      nameAr: 'تطبيق عرض بسيط',
      description: 'Basic app for displaying information and content',
      descriptionAr: 'تطبيق بسيط لعرض المعلومات والمحتوى',
      icon: '📱',
      category: 'utility',
      complexity: 'simple',
      estimatedTime: '3-5 دقائق',
      features: ['content-display', 'navigation', 'basic-styling'],
      colors: {
        primary: '#98FF98', // Default mint
        secondary: '#1E3A8A', // Default marine
        accent: '#F5F5DC'   // Default sand
      },
      screens: ['home', 'about', 'contact'],
      setupQuestions: [
        'ما اسم التطبيق؟',
        'ما المحتوى الذي تريد عرضه؟',
        'هل تحتاج صفحة تواصل؟'
      ]
    }
  ];

  /**
   * Get template by app type
   */
  public static getTemplateByType(appType: string): SmartTemplate | null {
    return this.SMART_TEMPLATES.find(template => 
      template.id.startsWith(appType)
    ) || null;
  }

  /**
   * Get all available templates
   */
  public static getAllTemplates(): SmartTemplate[] {
    return this.SMART_TEMPLATES;
  }

  /**
   * Get templates by category
   */
  public static getTemplatesByCategory(category: string): SmartTemplate[] {
    return this.SMART_TEMPLATES.filter(template => template.category === category);
  }

  /**
   * Get template recommendations based on prompt analysis
   */
  public static getRecommendedTemplates(analysis: any): SmartTemplate[] {
    const recommendations: SmartTemplate[] = [];
    
    // Add exact match if found
    if (analysis.appType) {
      const exactMatch = this.getTemplateByType(analysis.appType);
      if (exactMatch) {
        recommendations.push(exactMatch);
      }
    }

    // Add complexity-based recommendations
    const complexityMatches = this.SMART_TEMPLATES.filter(
      template => template.complexity === analysis.complexity
    );
    recommendations.push(...complexityMatches.slice(0, 2));

    // Add popular templates if list is short
    if (recommendations.length < 3) {
      const popular = this.SMART_TEMPLATES
        .filter(t => ['restaurant-smart', 'ecommerce-smart'].includes(t.id))
        .filter(t => !recommendations.includes(t));
      recommendations.push(...popular);
    }

    return recommendations.slice(0, 3); // Max 3 recommendations
  }

  /**
   * Generate template-specific prompt enhancement
   */
  public static enhancePromptWithTemplate(
    originalPrompt: string, 
    template: SmartTemplate,
    userResponses: Record<string, any>
  ): string {
    let enhancedPrompt = `إنشاء ${template.nameAr} باستخدام Flutter:\n\n`;
    
    enhancedPrompt += `**الطلب الأصلي:** ${originalPrompt}\n\n`;
    
    enhancedPrompt += `**تفاصيل التطبيق:**\n`;
    enhancedPrompt += `• النوع: ${template.nameAr}\n`;
    enhancedPrompt += `• التعقيد: ${template.complexity}\n`;
    enhancedPrompt += `• الوقت المقدر: ${template.estimatedTime}\n\n`;

    enhancedPrompt += `**الألوان المطلوبة:**\n`;
    enhancedPrompt += `• اللون الأساسي: ${template.colors.primary}\n`;
    enhancedPrompt += `• اللون الثانوي: ${template.colors.secondary}\n`;
    enhancedPrompt += `• لون التمييز: ${template.colors.accent}\n\n`;

    enhancedPrompt += `**الشاشات المطلوبة:**\n`;
    enhancedPrompt += template.screens.map(screen => `• ${screen}`).join('\n') + '\n\n';

    enhancedPrompt += `**الميزات المطلوبة:**\n`;
    enhancedPrompt += template.features.map(feature => `• ${feature}`).join('\n') + '\n\n';

    if (userResponses.basicInfo) {
      enhancedPrompt += `**معلومات المستخدم:**\n`;
      enhancedPrompt += `• الاسم: ${userResponses.basicInfo.name}\n`;
      enhancedPrompt += `• الوصف: ${userResponses.basicInfo.description}\n\n`;
    }

    enhancedPrompt += `**متطلبات خاصة:**\n`;
    enhancedPrompt += `• التطبيق مخصص للمستخدمين غير المبرمجين\n`;
    enhancedPrompt += `• يجب أن يكون بسيط وسهل الاستخدام\n`;
    enhancedPrompt += `• استخدم أفضل ممارسات Flutter\n`;
    enhancedPrompt += `• أضف تعليقات واضحة في الكود\n`;
    enhancedPrompt += `• اجعل التطبيق يعمل مباشرة بدون أخطاء\n\n`;

    enhancedPrompt += `يرجى إنشاء التطبيق خطوة بخطوة مع شرح كل خطوة بوضوح.`;

    return enhancedPrompt;
  }
}
