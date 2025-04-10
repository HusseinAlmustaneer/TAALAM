import { useState, useEffect, useCallback } from 'react';
import { Language, getTranslation, languages } from './index';

// استخدام localStorage للحفاظ على تفضيل اللغة
const LANGUAGE_KEY = 'preferred_language';

export function useTranslation() {
  // تعيين اللغة الافتراضية إلى العربية
  const [currentLang, setCurrentLang] = useState<Language>('ar');
  
  // تحميل تفضيل اللغة المحفوظ عند تحميل التطبيق
  useEffect(() => {
    const storedLang = localStorage.getItem(LANGUAGE_KEY) as Language | null;
    if (storedLang && storedLang in languages) {
      setCurrentLang(storedLang);
      // تعيين اتجاه الصفحة بناءً على اللغة
      document.documentElement.dir = storedLang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = storedLang;
    }
  }, []);
  
  // تغيير اللغة
  const changeLang = useCallback((lang: Language) => {
    if (lang in languages) {
      setCurrentLang(lang);
      localStorage.setItem(LANGUAGE_KEY, lang);
      // تحديث اتجاه الصفحة
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    }
  }, []);
  
  // دالة للحصول على الترجمة
  const t = useCallback((key: string): string => {
    return getTranslation(currentLang, key);
  }, [currentLang]);
  
  return {
    lang: currentLang,
    t,
    changeLang,
    languages
  };
}