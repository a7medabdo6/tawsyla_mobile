import { useState } from "react";
import { translations, Language } from "../constants/translations";

export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("ar");
  const [isRTL, setIsRTL] = useState(true);

  const t = (key: string) => {
    const keys = key?.split(".") || [];
    let value: any = translations[currentLanguage];

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return key; // Return the key if translation not found
      }
    }

    return typeof value === "string" ? value : key;
  };

  const changeLanguage = (language: Language) => {
    setCurrentLanguage(language);
  };

  return {
    currentLanguage,
    isRTL,
    t,
    changeLanguage,
  };
};
