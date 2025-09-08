/**
 * Preview Engine Selector - Hybrid System
 * Automatically chooses between Sandpack and WebContainer based on project type
 */

export type PreviewEngine = 'sandpack' | 'webcontainer';

export interface ProjectAnalysis {
  framework: 'flutter' | 'react' | 'vue' | 'html' | 'nodejs' | 'python' | 'general';
  complexity: 'simple' | 'medium' | 'complex';
  hasBackend: boolean;
  hasDatabase: boolean;
  hasNativeFeatures: boolean;
  fileTypes: string[];
  estimatedLoadTime: number;
}

export interface EngineRecommendation {
  engine: PreviewEngine;
  reason: string;
  confidence: number;
  estimatedLoadTime: number;
  fallbackEngine?: PreviewEngine;
}

export class PreviewEngineSelector {
  
  // Selection rules matrix
  private static SELECTION_RULES = [
    {
      condition: (analysis: ProjectAnalysis) => analysis.framework === 'flutter',
      engine: 'webcontainer' as PreviewEngine,
      reason: 'Flutter requires full container environment for Dart SDK and pub packages',
      confidence: 0.95,
      estimatedLoadTime: 90
    },
    {
      condition: (analysis: ProjectAnalysis) => analysis.hasNativeFeatures,
      engine: 'webcontainer' as PreviewEngine,
      reason: 'Native features require full system environment',
      confidence: 0.9,
      estimatedLoadTime: 60
    },
    {
      condition: (analysis: ProjectAnalysis) => analysis.hasBackend || analysis.hasDatabase,
      engine: 'webcontainer' as PreviewEngine,
      reason: 'Backend services require full container environment',
      confidence: 0.85,
      estimatedLoadTime: 45
    },
    {
      condition: (analysis: ProjectAnalysis) => 
        analysis.framework === 'react' && analysis.complexity === 'simple',
      engine: 'sandpack' as PreviewEngine,
      reason: 'Simple React projects work great with instant Sandpack preview',
      confidence: 0.8,
      estimatedLoadTime: 5
    },
    {
      condition: (analysis: ProjectAnalysis) => 
        analysis.framework === 'html' && analysis.complexity === 'simple',
      engine: 'sandpack' as PreviewEngine,
      reason: 'Static HTML/CSS/JS projects are perfect for Sandpack',
      confidence: 0.9,
      estimatedLoadTime: 3
    },
    {
      condition: (analysis: ProjectAnalysis) => 
        analysis.framework === 'vue' && analysis.complexity === 'simple',
      engine: 'sandpack' as PreviewEngine,
      reason: 'Simple Vue projects run instantly with Sandpack',
      confidence: 0.8,
      estimatedLoadTime: 5
    }
  ];

  /**
   * Analyze project from prompt and files
   */
  public static analyzeProject(prompt: string, files?: Record<string, any>): ProjectAnalysis {
    const lowerPrompt = prompt.toLowerCase();
    
    // Detect framework
    const framework = this.detectFramework(lowerPrompt, files);
    
    // Detect complexity
    const complexity = this.detectComplexity(lowerPrompt, files);
    
    // Detect backend requirements
    const hasBackend = this.detectBackend(lowerPrompt, files);
    
    // Detect database usage
    const hasDatabase = this.detectDatabase(lowerPrompt, files);
    
    // Detect native features
    const hasNativeFeatures = this.detectNativeFeatures(lowerPrompt, files);
    
    // Get file types
    const fileTypes = this.getFileTypes(files);
    
    // Estimate load time based on complexity
    const estimatedLoadTime = this.estimateLoadTime(framework, complexity, hasBackend);

    return {
      framework,
      complexity,
      hasBackend,
      hasDatabase,
      hasNativeFeatures,
      fileTypes,
      estimatedLoadTime
    };
  }

  /**
   * Select optimal preview engine
   */
  public static selectEngine(analysis: ProjectAnalysis): EngineRecommendation {
    // Apply rules in order of priority
    for (const rule of this.SELECTION_RULES) {
      if (rule.condition(analysis)) {
        return {
          engine: rule.engine,
          reason: rule.reason,
          confidence: rule.confidence,
          estimatedLoadTime: rule.estimatedLoadTime,
          fallbackEngine: rule.engine === 'webcontainer' ? 'sandpack' : 'webcontainer'
        };
      }
    }

    // Default fallback to WebContainer for quality assurance
    return {
      engine: 'webcontainer',
      reason: 'Default choice for comprehensive project support',
      confidence: 0.7,
      estimatedLoadTime: 60,
      fallbackEngine: 'sandpack'
    };
  }

  /**
   * Get user-friendly explanation
   */
  public static getEngineExplanation(recommendation: EngineRecommendation): string {
    const explanations = {
      sandpack: `
⚡ **معاينة فورية (Sandpack)**

**لماذا هذا الخيار؟**
• معاينة فورية خلال ثوانٍ
• مناسب للمشاريع البسيطة
• استهلاك ذاكرة أقل
• تحديث مباشر مع كل تغيير

**الوقت المتوقع:** ${recommendation.estimatedLoadTime} ثانية
      `,
      webcontainer: `
🚀 **بيئة تطوير كاملة (WebContainer)**

**لماذا هذا الخيار؟**
• دعم كامل لـ Flutter وDart
• بيئة Linux حقيقية
• يمكن تشغيل جميع أنواع التطبيقات
• نتائج احترافية وقابلة للنشر

**الوقت المتوقع:** ${recommendation.estimatedLoadTime} ثانية
      `
    };

    return explanations[recommendation.engine];
  }

  // Helper methods for detection
  private static detectFramework(prompt: string, files?: Record<string, any>): ProjectAnalysis['framework'] {
    // Check files first
    if (files) {
      if (Object.keys(files).some(file => file.endsWith('.dart') || file === 'pubspec.yaml')) {
        return 'flutter';
      }
      if (Object.keys(files).some(file => file === 'package.json')) {
        const packageJson = files['package.json'];
        if (packageJson && packageJson.includes('react')) return 'react';
        if (packageJson && packageJson.includes('vue')) return 'vue';
        return 'nodejs';
      }
      if (Object.keys(files).some(file => file.endsWith('.html'))) {
        return 'html';
      }
    }

    // Check prompt
    if (prompt.includes('flutter') || prompt.includes('dart') || prompt.includes('موبايل') || prompt.includes('mobile')) {
      return 'flutter';
    }
    if (prompt.includes('react') || prompt.includes('jsx')) return 'react';
    if (prompt.includes('vue')) return 'vue';
    if (prompt.includes('html') || prompt.includes('website') || prompt.includes('موقع')) return 'html';
    if (prompt.includes('nodejs') || prompt.includes('server') || prompt.includes('خادم')) return 'nodejs';
    
    return 'flutter'; // Default for CodeLaunch
  }

  private static detectComplexity(prompt: string, files?: Record<string, any>): ProjectAnalysis['complexity'] {
    let complexity: ProjectAnalysis['complexity'] = 'simple';
    
    // Check prompt indicators
    const complexIndicators = ['api', 'database', 'قاعدة بيانات', 'authentication', 'تسجيل دخول', 'payment', 'دفع'];
    const mediumIndicators = ['form', 'نموذج', 'navigation', 'تنقل', 'multiple pages', 'عدة صفحات'];
    
    if (complexIndicators.some(indicator => prompt.includes(indicator))) {
      complexity = 'complex';
    } else if (mediumIndicators.some(indicator => prompt.includes(indicator))) {
      complexity = 'medium';
    }

    // Check files
    if (files) {
      const fileCount = Object.keys(files).length;
      if (fileCount > 20) complexity = 'complex';
      else if (fileCount > 10) complexity = 'medium';
    }

    return complexity;
  }

  private static detectBackend(prompt: string, files?: Record<string, any>): boolean {
    const backendIndicators = ['api', 'server', 'backend', 'خادم', 'قاعدة بيانات', 'database'];
    return backendIndicators.some(indicator => prompt.includes(indicator));
  }

  private static detectDatabase(prompt: string, files?: Record<string, any>): boolean {
    const dbIndicators = ['database', 'قاعدة بيانات', 'sql', 'mongodb', 'firebase', 'supabase'];
    return dbIndicators.some(indicator => prompt.includes(indicator));
  }

  private static detectNativeFeatures(prompt: string, files?: Record<string, any>): boolean {
    const nativeIndicators = ['camera', 'كاميرا', 'gps', 'موقع', 'notification', 'إشعارات', 'native'];
    return nativeIndicators.some(indicator => prompt.includes(indicator));
  }

  private static getFileTypes(files?: Record<string, any>): string[] {
    if (!files) return [];
    
    const extensions = Object.keys(files).map(file => {
      const parts = file.split('.');
      return parts.length > 1 ? parts.pop()! : '';
    });
    
    return [...new Set(extensions)].filter(ext => ext);
  }

  private static estimateLoadTime(
    framework: ProjectAnalysis['framework'], 
    complexity: ProjectAnalysis['complexity'],
    hasBackend: boolean
  ): number {
    let baseTime = 0;
    
    // Base time by framework
    switch (framework) {
      case 'flutter': baseTime = 60; break;
      case 'nodejs': baseTime = 30; break;
      case 'react': baseTime = 10; break;
      case 'vue': baseTime = 10; break;
      case 'html': baseTime = 3; break;
      default: baseTime = 20;
    }
    
    // Complexity multiplier
    switch (complexity) {
      case 'simple': baseTime *= 1; break;
      case 'medium': baseTime *= 1.5; break;
      case 'complex': baseTime *= 2; break;
    }
    
    // Backend additional time
    if (hasBackend) baseTime += 20;
    
    return Math.round(baseTime);
  }
}
