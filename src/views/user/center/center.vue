<template>
  <div id="userCenterPage" class="max-width-content">
    <a-row>
      <!-- 左侧用户信息 -->
      <a-col :span="6">
        <a-card class="user-card" style="text-align: center;">
          <a-avatar :src="user.userAvatar" size="72" />
          <div style="margin-bottom: 16px" />
        </a-card>
      </a-col>

      <!-- 右侧内容部分 -->
      <a-col :span="18">
        <a-card :tab-list="tabList" v-model:active-tab="activeTabKey">
          <!-- 刷题记录 -->
          <template #default>
            <div v-if="activeTabKey === 'record'">
              <calendar />
            </div>
            <div v-if="activeTabKey === 'others'">
              bbb
            </div>
          </template>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/user";
import Calendar from "@/views/user/center/calendar.vue";

// 获取 Pinia store 状态
const userStore = useUserStore(); // 使用 Pinia Store
const user = userStore.user; // 获取登录的用户信息

// 控制 Tab 选项卡的高亮
const activeTabKey = ref("record");

// Tab 列表配置
const tabList = [
  { key: "record", tab: "刷题记录" },
  { key: "others", tab: "其他" },
];
</script>

<style scoped>
#userCenterPage {
  max-width: 1200px;
  margin: 0 auto;
}
.user-card {
  text-align: center;
}
</style>
