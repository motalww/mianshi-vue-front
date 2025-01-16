<template>
  <div v-if="bank">
    <!-- 外层容器 -->
    <a-card class="card-container">
      <div class="card-content-wrapper">
        <!-- 左侧图片 -->
        <div class="card-icon">
          <img :src="bank.picture" alt="题库图标" class="icon-image"/>
        </div>
        <!-- 右侧内容 -->
        <div class="card-content">
          <h1 class="card-title">{{ bank.title }}</h1>
          <p class="card-description">{{ bank.description }}</p>
          <div class="card-actions">
            <a-button type="primary" @click="startPractice">开始刷题</a-button>
            <a-button type="default" @click="share">分享</a-button>
          </div>
        </div>
      </div>
    </a-card>
  </div>

  <!-- 加载中提示 -->
  <div v-else class="loading-container">
    <a-spin size="large" tip="正在加载题库和题目..."/>
  </div>

  <!-- 题目列表 -->
  <div class="question-list">
    <a-card title="题目列表" class="card-container">
      <a-table
          :dataSource="questionList"
          :columns="columns"
          row-key="id"
          :pagination="false"
      >
        <!-- 自定义渲染题目列 -->
        <template #bodyCell="{ record, column }">
          <div v-if="column.key === 'title'">
            <a>{{ record.question.title }}</a>
          </div>
          <div v-else-if="column.key === 'tags'">
            <a-tag v-for="(tag, index) in record.question.tagList" :key="index">
              {{ tag }}
            </a-tag>
          </div>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import {useRoute} from "vue-router";
import {getQuestionBankVoByIdUsingGet} from "@/api/questionBankController.ts";
import {listQuestionBankQuestionVoByPageUsingPost} from "@/api/questionBankQuestionController.ts";
import getQuestionBankVOByIdUsingGETParams = API.getQuestionBankVOByIdUsingGETParams;
import QuestionBankQuestionQueryRequest = API.QuestionBankQuestionQueryRequest;
import {message} from "ant-design-vue";

// 获取动态路由参数
const route = useRoute();

// 响应式变量存储数据
const bank = ref(null);
const bankBody: getQuestionBankVOByIdUsingGETParams = {
  id: route.params.bankId,
};
const questionList = ref([]);
const questionBody: QuestionBankQuestionQueryRequest = {
  questionBankId: route.params.bankId,
};

// 定义列
const columns = [
  {
    title: "题目",
    dataIndex: "question.title",
    key: "title",
  },
  {
    title: "标签",
    dataIndex: "question.tagList",
    key: "tags",
  },
];

// 定义方法：根据 ID 获取题库详情
const fetchBankDetails = async () => {
  try {
    // 获取题库详情
    const bankRes = await getQuestionBankVoByIdUsingGet(bankBody);
    bank.value = bankRes.data;

    // 获取题库中的问题列表
    const questionRes = await listQuestionBankQuestionVoByPageUsingPost(questionBody);
    questionList.value = questionRes.data.records;
  } catch (error) {
    message.error(`获取题库详情失败:${error.message},请稍后重试`);
  }
};

// 初始化时加载数据 & 监听路由参数变化
watch(
    () => route.params.bankId, // 监听 id 参数变化
    (newId) => {
      if (newId) fetchBankDetails();
    },
    {immediate: true} // 组件加载时立即触发
);

// 开始刷题按钮逻辑
const startPractice = () => {
  message.success(`开始刷题: ${bank.value.title}`);
};

// 分享按钮逻辑
const share = () => {
  message.success(`分享题库: ${bank.value.title}`);
};
</script>

<style scoped>
/* 卡片样式 */
.card-container {
  align-items: center;
  background-color: #fff;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-content-wrapper {
  display: flex; /* 使用 Flexbox 布局 */
  align-items: center; /* 垂直居中 */
  gap: 20px; /* 左右间距 */
}

.card-icon {
  flex-shrink: 0;
  margin-right: 20px;
}

.icon-image {
  width: 120px;
  height: 120px;
  object-fit: contain;
}

.card-content {
  flex: 1;
}

.card-title {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  color: #333;
}

.card-description {
  font-size: 14px;
  color: #666;
  margin: 10px 0 20px;
  line-height: 1.6;
}

.card-actions {
  display: flex;
  gap: 10px;
}

.question-list {
  margin-top: 20px;
}


/* 加载提示 */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
}


</style>
