import { createRouter, createWebHistory } from 'vue-router';
import { menus } from './menu.ts';  // 引入菜单配置

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes: menus,  // 动态路由配置
});

export default router;
