import { createApp } from 'vue';
import './style.css'; 
import App from './App.vue';
import router from './routes';
import 'vuetify/dist/vuetify.min.css';
import { createVuetify } from 'vuetify'
import { createPinia } from 'pinia'

import { aliases, mdi } from 'vuetify/iconsets/mdi';
const pinia = createPinia()

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  });

createApp(App).use(router).use(vuetify).use(pinia).mount('#app');
