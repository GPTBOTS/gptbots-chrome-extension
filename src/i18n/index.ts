import { createI18n } from 'vue-i18n';
import { useStorage } from '../hooks/use-storage';
import { Locale } from '@/types/default';
import zh_CN from './zh_CN';
import en_US from './en_US';
import zh_TW from './zh_TW';
import ja_JP from './ja_JP';
import es_ES from './es_ES';
import th_TH from './th_TH';
import { ref } from 'vue';

const { getStorage } = useStorage();

const i18n = ref<ReturnType<typeof createI18n> | undefined>();

export function updateLocale(locale: Locale) {
  if (i18n.value) {
    i18n.value.global.locale = locale;
  }
}

export default async function initI18n() {
  const locale = (await getStorage('locale')) || Locale.EN_US;
  i18n.value = createI18n({
    locale,
    legacy: false,
    messages: {
      zh_CN,
      zh_TW,
      en_US,
      ja_JP,
      es_ES,
      th_TH,
    },
    fallbackLocale: Locale.EN_US,
  });
  return i18n.value;
}
