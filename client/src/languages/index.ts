import arTranslations from './ar/translations.json';
import enTranslations from './en/translations.json';

export type Language = 'ar' | 'en';

export const languages: Record<Language, string> = {
  ar: 'العربية',
  en: 'English'
};

export const translations = {
  ar: arTranslations,
  en: enTranslations
};

// استرجاع قيمة مترجمة باستخدام مسار مثل "common.appName"
export function getTranslation(lang: Language, path: string): string {
  const keys = path.split('.');
  let value: any = translations[lang];
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return path; // إذا لم يتم العثور على الترجمة، أعد المسار الأصلي
    }
  }
  
  return typeof value === 'string' ? value : path;
}