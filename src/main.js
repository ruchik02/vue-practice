import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import App from './App.vue'
import 'vuetify/styles'
import * as components from 'vuetify/components'
import router from './router'
import '@mdi/font/css/materialdesignicons.css'
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './firebaseConfig'
const vuetify = createVuetify({
    theme:{
        defaultTheme: 'light',
        themes: {
            light: { },
            dark: {  }
        }
    },
    icons: {
        defaultSet: 'mdi',
    },
    components
})
let app;
// Wait for Firebase to check user state before initializing the app
onAuthStateChanged(auth, (user) => {
    if (!app) {
      app = createApp(App);
      app.use(vuetify); // Register Vuetify
      app.use(router);  // Register Vue Router
      app.mount("#app"); // Mount the app
    }
  });
