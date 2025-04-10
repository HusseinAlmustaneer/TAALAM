// إعدادات التطبيق
export const config = {
  // اسم التطبيق
  appName: 'تعلّم',
  
  // الإعدادات الافتراضية
  defaults: {
    language: 'ar' as const,
    theme: 'light' as const,
  },
  
  // إعدادات الواجهة
  ui: {
    // عدد العناصر في الصفحة الواحدة
    pageSize: 12,
    // أقصى طول للوصف المختصر
    truncatedDescriptionLength: 120,
  },
  
  // إعدادات API
  api: {
    // المسار الأساسي للـ API
    baseUrl: '/api',
    
    // مسارات API المختلفة
    endpoints: {
      courses: '/courses',
      users: '/users',
      auth: {
        login: '/login',
        register: '/register',
        logout: '/logout',
        user: '/user',
      },
      enrollments: '/enrollments',
      certificates: '/certificates',
    },
    
    // مهلة الانتظار للطلبات (بالمللي ثانية)
    timeout: 10000,
  },
  
  // روابط مواقع التواصل الاجتماعي
  social: {
    facebook: 'https://facebook.com/taallam',
    twitter: 'https://twitter.com/taallam',
    instagram: 'https://instagram.com/taallam',
    linkedin: 'https://linkedin.com/company/taallam',
  },
  
  // إعدادات التحقق من الشهادات
  certificates: {
    // رابط التحقق من الشهادات
    verifyUrl: '/verify-certificate',
  },
};