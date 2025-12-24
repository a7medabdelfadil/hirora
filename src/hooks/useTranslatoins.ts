import useLanguageStore from "~/APIs/store";
import en from "~/locales/en.json";
import ar from "~/locales/ar.json";
type Language = "en" | "ar";

const translations: Record<Language, Record<string, string>> = {
    en,
    ar,
};

export const useTranslation = () => {
    const language = useLanguageStore((state) => state.language); // "en", "ar"
    const dictionary = translations[language as Language] || translations.en;

    const t = (key: string, vars?: Record<string, string>) => {
        let text = dictionary[key] || key;
        if (vars) {
            Object.entries(vars).forEach(([k, v]) => {
                text = text.replace(`{{${k}}}`, v);
            });
        }
        return text;
    };

    return { t, language };
};