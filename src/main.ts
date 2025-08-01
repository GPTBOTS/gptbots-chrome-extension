import { createApp } from 'vue';
import App from './App.vue';
import './index.less';
import initI18n from './i18n';
import { useGlobalData } from './hooks/use-global-data';

initI18n().then((i18n) => {
  useGlobalData(i18n);
  createApp(App).use(i18n).mount('#root');
});
