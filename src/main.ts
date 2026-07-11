import { createApp } from 'vue'
import App from './App.vue'
import router from './routes'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

import ToastService from 'primevue/toastservice'

import 'primeicons/primeicons.css'

const app = createApp(App)

app.use(router)

app.use(PrimeVue, {
  theme: {
    preset: Aura,
     options: {
      darkModeSelector: false, // Force light mode
    },
  },
  ripple: true,
})

app.use(ToastService)

app.mount('#app')