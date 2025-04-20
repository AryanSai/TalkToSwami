import { useState, useEffect } from 'react';
import translations from '../assets/main.json';

const useTranslation = (selectedLanguage: string) => {
    const [translatedText, setTranslatedText] = useState(translations.english);

    useEffect(() => {
        if (translations[selectedLanguage as keyof typeof translations]) {
            setTranslatedText(translations[selectedLanguage as keyof typeof translations]);
        } else {
            setTranslatedText(translations.english);
        }
    }, [selectedLanguage]);

    return translatedText;
};

export default useTranslation;