<template>
  <div class="card-container" v-if="bank">
    <div class="card-icon">
      <img :src="bank.picture" alt="Icon" class="icon-image" />
    </div>
    <div class="card-content">
      <h1 class="card-title">{{ bank.title }}</h1>
      <p class="card-description">{{ bank.description }}</p>
      <div class="card-actions">
        <button class="btn btn-primary" @click="startPractice">开始刷题</button>
        <button class="btn btn-secondary" @click="share">分享</button>
      </div>
    </div>
  </div>
  <div v-else>
    <p>加载中...</p>
  </div>
  <div class="question-list">
    <h2>题目列表</h2>
    <el-table
        :data="questionList"
        stripe
        :header-cell-style="{fontSize:'16px',color:'black'}"
        :default-sort="{ prop: 'difficulty', order: 'ascending' }"
    >
      <!-- 题目列 -->
      <el-table-column prop="title" label="题目"  align="left">
        <template #default="scope">
        </template>
      </el-table-column>

      <!-- 难度列 -->
      <el-table-column prop="difficulty" label="难度" align="right">
<!--        <template #default="scope">-->
<!--          <el-tag v-for="(tag, index) in scope.row" :key="index" effect="plain">-->
<!--            {{ tag }}-->
<!--          </el-tag>-->
<!--        </template>-->
      </el-table-column>

      <!-- 标签列 -->
      <el-table-column prop="tagList" label="标签" align="right" >
        <template #default="scope">
          <el-tag v-for="(tag, index) in scope.row.tagList" :key="index" effect="plain">
            {{ tag }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>


<script setup lang="ts">
import {ref, watch} from 'vue'; // 引入 Composition API
import {useRoute} from 'vue-router';
import {getQuestionBankVoByIdUsingGet} from "@/api/questionBankController.ts";
import getQuestionBankVOByIdUsingGETParams = API.getQuestionBankVOByIdUsingGETParams;
import {listQuestionVoByPageUsingPost} from "@/api/questionController.ts";
import QuestionQueryRequest = API.QuestionQueryRequest;


// 获取动态路由参数
const route = useRoute();

// 响应式变量存储数据
const bank = ref(null);
const bankBody:getQuestionBankVOByIdUsingGETParams={
  id:route.params.bankId
}
const questionList=ref([])
const questionBody:QuestionQueryRequest={
  questionBankId:route.params.bankId
}

// 定义方法：根据 ID 获取题库详情
const fetchBankDetails = async (bankId) => {
  try {
    console.log(bankId)
    const bankRes = await getQuestionBankVoByIdUsingGet(bankBody); // 调用后端 API
    bank.value = bankRes.data; // 存储响应数据
    const questionRes=await listQuestionVoByPageUsingPost(questionBody)
    console.log(questionRes)
    questionList.value=questionRes.data.records
  } catch (error) {
    console.error('获取题库详情失败:', error);
  }
};

// 初始化时加载数据 & 监听路由参数变化
watch(
    () => route.params.bankId, // 监听 id 参数
    (newId) => {
      if (newId) fetchBankDetails(newId);
    },
    {immediate: true} // 组件加载时立即触发
);

// 开始刷题按钮逻辑
const startPractice = () => {
  alert(`开始刷题: ${bank.value.title}`);
};

// 分享按钮逻辑
const share = () => {
  alert(`分享题库: ${bank.value.title}`);
};
</script>

<style scoped>
/* 卡片样式 */
.card-container {
  display: flex;
  align-items: center;
  background-color: #fff;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
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

.btn {
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: #fff;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #f0f0f0;
  color: #333;
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}

/* 表格样式 */
.question-list {
  margin: 20px auto;
  padding: 20px;
  background-color: #fff;
  border: 1px solid #eaeaea;
  border-radius: 8px;
}
.el-table th {
  white-space: nowrap; /* 禁止换行 */
  text-align: center; /* 居中对齐 */
  line-height: 1.6; /* 正常的行高 */
  font-size: 14px; /* 字体大小 */
  font-weight: bold; /* 加粗 */
  color: #333; /* 颜色 */
}

h2 {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}


.el-table td {
  padding: 12px 10px;
}


.el-table tr:hover {
  background-color: #f9f9f9;
}

.question-title {
  color: #007bff;
  text-decoration: none;
  cursor: pointer;
}

.question-title:hover {
  text-decoration: underline;
}

.difficulty-easy {
  color: #28a745;
  font-weight: bold;
}

.difficulty-medium {
  color: #fd7e14;
  font-weight: bold;
}

.difficulty-hard {
  color: #dc3545;
  font-weight: bold;
}

.tag {
  margin-right: 5px;
  font-size: 12px;
}
</style>

