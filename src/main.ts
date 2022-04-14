import { createApp } from 'vue';
import App from './App.vue';
import ShengElementPlusComponents from '../packages';
import router from './router';

createApp(App)
    .use(router)
    .use(ShengElementPlusComponents)
    .mount('#app');
