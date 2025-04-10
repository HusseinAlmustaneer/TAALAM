import React from 'react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTranslation } from '@/languages/useTranslation';
import { Language, languages } from '@/languages';

export function LanguageSwitcher() {
  const { lang, changeLang } = useTranslation();
  
  const handleLanguageChange = (language: Language) => {
    changeLang(language);
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <span>{lang === 'ar' ? 'العربية' : 'English'}</span>
          <i className="fas fa-globe text-sm"></i>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(languages).map(([langKey, langName]) => (
          <DropdownMenuItem 
            key={langKey}
            onClick={() => handleLanguageChange(langKey as Language)}
            className={langKey === lang ? 'bg-primary/10 font-semibold' : ''}
          >
            {langName}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}