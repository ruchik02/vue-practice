import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import App from './App.vue'
import 'vuetify/styles'
import * as components from 'vuetify/components'
import router from './router'
const vuetify = createVuetify({
    theme:{
        defaultTheme: 'light',
        themes: {
            light: { },
            dark: {  }
        }
    },
    components
})


const app = createApp(App);
app.use(vuetify); // Register Vuetify
app.use(router);  // Register Vue Router
app.mount('#app'); // Mount the app
