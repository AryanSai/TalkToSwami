import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import JSON translations
import en from './assets/translations/en.json';
import hi from './assets/translations/hi.json'; // Hindi as an example

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
  },
  lng: 'en', // Default language
  fallbackLng: 'en', // Fallback to English if the language is unavailable
  interpolation: {
    escapeValue: false, // React already protects from XSS
  },
});

export default i18n;
