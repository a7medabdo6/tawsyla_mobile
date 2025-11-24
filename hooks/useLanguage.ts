import { useState, useEffect } from "react";
import { I18nManager } from "react-native";
import { translations, Language } from "../constants/translations";

export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("ar");
  const [isRTL, setIsRTL] = useState(true);

  useEffect(() => {
    // Set RTL based on language
    const shouldBeRTL = currentLanguage === "ar";
    if (shouldBeRTL !== isRTL) {
      setIsRTL(shouldBeRTL);
      // Force RTL layout change
      I18nManager.forceRTL(shouldBeRTL);
    }
  }, [currentLanguage, isRTL]);

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
