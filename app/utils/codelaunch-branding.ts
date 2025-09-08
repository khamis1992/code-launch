/**
 * هوية CodeLaunch - الألوان والنصوص والثوابت
 */

export const CODELAUNCH_BRAND = {
  // معلومات أساسية
  name: 'CodeLaunch',
  tagline: 'AI-Powered Development Platform',
  description: 'منصة التطوير الذكية التي تساعدك في إنشاء تطبيقات رائعة',
  domain: 'CodeLaunch.ai',

  // الألوان الأساسية - التصميم الاحترافي الجديد
  colors: {
    primary: '#98FF98', // 🌿 Mint Green - اللون الأساسي
    secondary: '#1E3A8A', // 🌊 Marine Navy Blue - اللون الثانوي
    accent: '#F5F5DC', // 🏖️ Light Sand Beige - لون التمييز
    success: '#98FF98', // Mint Green - النجاح
    warning: '#f59e0b', // Amber - التحذير
    error: '#ef4444', // Red - الخطأ
    background: '#0a0f1a', // Deep Navy - الخلفية الداكنة
    surface: '#111827', // Dark Surface - السطوح
    text: '#F5F5DC', // Sand Beige - النص الأساسي
    textSecondary: 'rgba(245, 245, 220, 0.8)', // النص الثانوي
  },

  // الرسائل الترحيبية
  messages: {
    welcome: 'مرحباً بك في CodeLaunch!',
    description: 'منصة التطوير الذكية التي تحول أفكارك إلى تطبيقات حقيقية',
    creating: 'CodeLaunch ينشئ تطبيقك...',
    ready: 'تطبيقك جاهز مع CodeLaunch!',
    powered: 'مدعوم بـ CodeLaunch',
    generated: 'تم إنشاؤه بواسطة CodeLaunch',
  },

  // معلومات الاتصال
  contact: {
    email: 'support@codelaunch.ai',
    website: 'https://codelaunch.ai',
    github: 'https://github.com/codelaunch-ai',
    twitter: 'https://twitter.com/codelaunch_ai',
  },

  // إعدادات التطبيق
  app: {
    id: 'com.codelaunch.ai',
    productName: 'CodeLaunch',
    userAgent: 'CodeLaunch-App',
    repositoryPrefix: 'codelaunch-',
  },
};

/**
 * دالة للحصول على رسالة ترحيبية عشوائية
 */
export function getWelcomeMessage(): string {
  const messages = [
    'مرحباً بك في CodeLaunch! 🚀',
    'أهلاً وسهلاً في منصة CodeLaunch! ✨',
    'مرحباً! دعنا ننشئ شيئاً رائعاً مع CodeLaunch! 🎯',
    'أهلاً بك في عالم التطوير الذكي مع CodeLaunch! 💡',
  ];

  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * دالة للحصول على رسالة إنجاز عشوائية
 */
export function getSuccessMessage(): string {
  const messages = [
    '🎉 تم إنشاء تطبيقك بنجاح مع CodeLaunch!',
    '✨ تطبيقك جاهز! CodeLaunch يفخر بما أنجزناه معاً!',
    '🚀 مبروك! تطبيقك الجديد جاهز للانطلاق!',
    '🎯 ممتاز! CodeLaunch ساعدك في إنشاء تطبيق رائع!',
  ];

  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * دالة للحصول على رسالة تحفيزية أثناء الإنشاء
 */
export function getCreatingMessage(): string {
  const messages = [
    '⚙️ CodeLaunch يعمل بجد لإنشاء تطبيقك...',
    '🔨 جاري بناء تطبيقك المميز...',
    '✨ CodeLaunch يحول فكرتك إلى واقع...',
    '🎨 نضع اللمسات الأخيرة على تطبيقك...',
  ];

  return messages[Math.floor(Math.random() * messages.length)];
}
