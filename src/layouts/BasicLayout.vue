<template>
  <div class="common-layout">
    <el-container>
      <!-- 顶部导航栏 -->
      <el-header class="header">
        <div class="header-content">
          <div class="logo">
            <img src="/src/assets/logo.svg" alt="Logo" />
            面试刷题神器
          </div>
          <el-menu
              default-active="/"
              mode="horizontal"
              background-color="#ffffff"
              text-color="#333"
              active-text-color="#000000"
              class="menu"
              router
          >
            <el-menu-item index="/">首页</el-menu-item>
            <el-menu-item index="/banks"  >题库</el-menu-item>
            <el-menu-item index="/questions">题目</el-menu-item>
            <el-menu-item ><el-icon><Monitor /></el-icon>管理</el-menu-item>
          </el-menu>
          <div class="header-right">
            <el-input placeholder="搜索题目" prefix-icon="Search" class="search-input" />
            <div class="user-info">
              <!-- 用户头像 -->
              <el-avatar
                  size="40"
                  class="user-avatar"
                  :src="user.userAvatar"
                  style="cursor: pointer;"
              ></el-avatar>
              <!-- 用户名 -->
              <span class="user-name">{{ user.userName }}</span>
            </div>
          </div>
        </div>
      </el-header>

      <!-- 主体内容 -->
      <el-main class="main">
       <router-view/>
      </el-main>

      <!-- 底部栏 -->
      <el-footer class="footer">
        <p>© 2025 面试刷题神器    - W</p>
      </el-footer>
    </el-container>
  </div>
</template>

<script setup>
import { useUserStore } from "@/stores/user";

const userStore = useUserStore(); // 使用 Pinia Store
const user = userStore.user;

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
