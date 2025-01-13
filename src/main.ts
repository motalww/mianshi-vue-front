import {createApp} from 'vue'
import {createPinia} from 'pinia'

import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import persistedState from "pinia-plugin-persistedstate";
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

// 创建 Pinia 实例并使用插件
const pinia = createPinia();
pinia.use(persistedState);
app.use(router)
app.use(pinia);
app.use(ElementPlus)
app.use(Antd)
app.mount('#app')
