<template>
  <div class="common-layout">
    <!-- 使用 Ant Design Vue 的 Layout 布局 -->
    <a-layout>
      <!-- 顶部导航栏 -->
      <a-layout-header class="header">
        <div class="header-content">
          <div class="logo">
            <img src="/src/assets/logo.svg" alt="Logo"/>
            面试刷题神器
          </div>
          <a-menu v-model:selectedKeys="current" :items="items"
                  mode="horizontal"
                  theme="light"
                  @select="handleSelect"
                  default-selected-keys="/"
                  class="menu"/>
          <div class="header-right">
            <a-input-search
                v-model:value="searchValue"
                placeholder="请输入题目"
                style="width: 200px"
                :loading="isLoading"
                @search="onSearch"
            />
            <div class="user-info">
              <!-- 用户头像与下拉菜单 -->
              <a-dropdown placement="bottom">
                <!-- 触发下拉菜单的内容 -->
                <template #default>
                  <a-avatar
                      size="large"
                      class="user-avatar"
                      :src="user.userAvatar"
                      style="cursor: pointer;"
                  />
                </template>
                <!-- 下拉菜单内容 -->
                <template #overlay>
                  <a-menu @click="dropDownClick">
                    <a-menu-item key="/user/center">个人中心</a-menu-item>
                    <a-menu-item key="/logout">退出登录</a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
              <!-- 用户名 -->
              <span class="user-name">{{ user.userName }}</span>
            </div>
          </div>
        </div>
      </a-layout-header>

      <!-- 主体内容 -->
      <a-layout-content class="main">
        <router-view/>
      </a-layout-content>

      <!-- 底部栏 -->
      <a-layout-footer class="footer">
        <p>© 2025 面试刷题神器 - W</p>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import {useUserStore} from "@/stores/user";
import {h, computed, ref} from "vue";
import {CrownOutlined} from '@ant-design/icons-vue';
import {MenuProps} from 'ant-design-vue';
import {message} from "ant-design-vue";
import router from "@/router";
import {userLogoutUsingPost} from "@/api/userController.ts";

const items = ref<MenuProps['items']>([
  {
    key: '/',
    label: '首页',
    title: '首页',
  },
  {
    key: '/banks',
    label: '题库',
    title: '题库',

  },
  {
    key: '/questions',
    label: '题目',
    title: '题目',
  },
  {
    label: '管理',
    icon: () => h(CrownOutlined),
    title: '管理',
    children: [
      {
        type: 'group',
        children: [
          {
            label: '用户管理',
            key: '/admin/user',
          },
          {
            label: '题目管理',
            key: '/admin/questions',
          },
          {
            label: '题库管理',
            key: '/admin/banks',
          },
        ],
      },
    ],
  },
]);

// 处理菜单选择
const handleSelect = (e) => {
  router.push(e.key); // 使用 vue-router 跳转
}

const userStore = useUserStore(); // 使用 Pinia Store
const user = computed(() => {
  return userStore.user;
});


const isLoading = ref<boolean>(false)
const searchValue = ref<string>(""); // 搜索值

const onSearch = async () => {
  isLoading.value = true;
  message.success("触发搜索");
  setTimeout(() => {
    isLoading.value = false;  // 停止加载
  }, 3000); // 3000 毫秒 = 3 秒
}

const dropDownClick: MenuProps['dropDownClick'] =async ({key}) => {
  if(key==='/user/center'){
    await router.push(key)
  }else if(key==='/logout'){
    try {
      await userLogoutUsingPost();
      userStore.clearUserInfo()
      message.success("退出登录成功")
    }catch(error) {
      message.error(error.message)
    }
  }
};
</script>

<style scoped>
/* 整体布局样式 */
.common-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 顶部导航栏 */
.header {
  background-color: #ffffff;
  border-bottom: 1px solid #eee;
  padding: 0 20px;
  display: flex;
  align-items: center;
  height: 64px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.logo {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
}

.logo img {
  height: 32px;
  margin-right: 8px;
}

.menu {
  flex: 1;
  font-size: 18px;
  margin-left: 20px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-input {
  width: 200px;
}

/* 用户信息容器 */
.user-info {
  display: flex;
  margin-right: 15px;
  align-items: center;
  gap: 10px; /* 头像和用户名之间的间距 */
}

/* 用户名样式 */
.user-name {
  font-size: 16px;
  color: #333;
  cursor: pointer;
}

/* 主体内容 */
.main {
  flex: 1;
  background-color: #f5f5f5;
  padding: 20px;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 底部栏 */
.footer {
  background-color: #ffffff;
  text-align: center;
  padding: 10px 20px;
  border-top: 1px solid #eee;
  font-size: 14px;
  color: #666;
}
</style>
