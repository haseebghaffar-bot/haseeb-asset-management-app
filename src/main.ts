import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';

import App from './App.vue';
import router from './router';

import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
import './styles/tailwind.css';
import './styles/globals.css';
import './styles/animations.css';

try {
  Amplify.configure(outputs);
} catch {
  console.warn(
    'Amplify configuration missing or invalid. Run "npx ampx sandbox" first to generate amplify_outputs.json'
  );
}

const app = createApp(App);

const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(ElementPlus);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component as any);
}
app.config.errorHandler = (err, _instance, info) => {
  console.error('[Global Vue Error]', err, info);
};

app.mount('#app');
