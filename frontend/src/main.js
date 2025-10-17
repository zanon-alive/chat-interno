import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './style.css';

const app = createApp(App);

// Pinia (state management)
app.use(createPinia());

// Vue Router
app.use(router);

// Montar app
app.mount('#app');
