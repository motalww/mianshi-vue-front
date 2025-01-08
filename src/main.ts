import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import {useUserStore} from "@/stores/user.ts";

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(createPinia())

// 初始化用户信息
const userStore = useUserStore();
await userStore.fetchUserInfo(); // 在应用加载时获取用户信息
app.use(router)

app.use(ElementPlus)
app.mount('#app')
