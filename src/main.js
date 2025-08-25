import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import { routes, applyGuards } from './router/index.js'
import './assets/main.css'
// PrimeVue
import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

applyGuards(router)

const app = createApp(App)
app.use(router)
app.use(PrimeVue, { ripple: true })
app.mount('#app')
