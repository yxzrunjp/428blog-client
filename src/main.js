import { createApp } from 'vue'
import '@/assets/css/style.scss'
import App from './App.vue'
// pinia
import { createPinia } from 'pinia'

// vue-router
import router from '@/router'

// components
import BlogItem from '@/components/BlogItem.vue'
import AsideContent from '@/components/AsideContent.vue'
import CategoryItem from '@/components/CategoryItem.vue'
import UserItem from '@/components/UserItem.vue'
const app = createApp(App)

app.use(router)
app.use(createPinia())

app.component('BlogItem',BlogItem)
app.component('AsideContent',AsideContent)
app.component('CategoryItem',CategoryItem)
app.component('UserItem',UserItem)

app.mount('#app')
