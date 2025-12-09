// i18nForTests.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import commonRU from '../public/locales/ru-RU/common.json';
import commonEN from '../public/locales/en-US/common.json';
import labelRU from '../public/locales/ru-RU/label.json';
import labelEN from '../public/locales/en-US/label.json';
import commonKY from '../public/locales/ky-KG/common.json';
import labelKY from '../public/locales/ky-KG/label.json';

i18n.use(initReactI18next).init({
  resources: {
    ru: {
      common: commonRU,
      label: labelRU,
    },
    en: {
      common: commonEN,
      label: labelEN,
    },
    ky: {
      common: commonKY,
      label: labelKY,
    }
  
  },
  lng: 'ru-RU',
  fallbackLng: 'ru-RU',
  debug: false,
  ns: ['label', 'common', 'settings', 'message', 'authorization', 'newCaseStepper'],
  defaultNS: 'common',
});

export default i18n;
