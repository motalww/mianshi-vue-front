<template>
  <div class="card-grid">
    <div class="card" v-for="(bank, index) in bankList" :key="index" @click="goToPage(bank.id)">
      <el-image :src="bank.picture" class="card-image"></el-image>
      <div class="card-content">
        <h3 class="card-title">{{ bank.title }}</h3>
        <p class="card-description">{{ bank.description }}</p>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import {onMounted, ref} from "vue";
import {listQuestionBankVoByPageUsingPost} from "@/api/questionBankController.ts";
import QuestionBankQueryRequest = API.QuestionBankQueryRequest;
import {useRouter} from "vue-router"; // 后端 API
const router = useRouter(); // Vue Router

const bankList = ref([])

onMounted(() => {
  listQuestionBankVoByPageUsingPost(body).then((res) => {
    if (res.code === 0) {
      bankList.value = res.data.records
    } else {
    }
  })
})
// 定义符合 QuestionBankQueryRequest 类型的 body 对象
const body: QuestionBankQueryRequest = {
  current: 1,        // 页码，可以根据需求调整
  pageSize: 10,      // 每页显示的条数
  // searchText: '',    // 搜索文本，根据需求填充
  // sortField: 'title', // 排序字段，可以根据需求调整
  // sortOrder: 'asc',  // 排序顺序（'asc' 或 'desc'）
  // 其他字段可以根据需要添加
};


// 点击跳转到指定页面
const goToPage = (bankId) => {
  console.log(`Navigating to: ${bankId}`);
  router.push(`/banks/${bankId}`);
  // 可以替换为 Vue Router 的跳转逻辑
  // this.$router.push(link); 如果用 Vue Router
};

</script>

<style scoped>
.card-grid {
  display: grid; /* 使用 CSS Grid 布局 */
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); /* 自动适配列宽 */
  gap: 20px; /* 卡片之间的间距 */
  padding: 20px; /* 容器的内边距 */
}

.card {
  display: flex; /* 卡片内部使用 Flexbox 实现横向布局 */
  align-items: center; /* 垂直居中对齐 */
  padding: 15px; /* 卡片内边距 */
  border: 1px solid #eaeaea; /* 边框样式 */
  border-radius: 8px; /* 圆角 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 阴影效果 */
  background-color: #fff; /* 背景颜色 */
}

.card-image {
  width: 50px; /* 图片宽度 */
  height: 50px; /* 图片高度 */
  border-radius: 4px; /* 图片圆角 */
  object-fit: cover; /* 图片自适应裁剪 */
  margin-right: 15px; /* 图片和文本内容之间的间距 */
}

.card-content {
  flex: 1; /* 占据剩余空间 */
}

.card-title {
  font-size: 16px; /* 标题字体大小 */
  font-weight: bold; /* 加粗标题 */
  margin: 0; /* 去掉默认外边距 */
  margin-bottom: 8px; /* 标题和描述之间的间距 */
}

.card-description {
  font-size: 14px; /* 描述字体大小 */
  color: #666; /* 描述文字颜色 */
  margin: 0; /* 去掉默认外边距 */
}
</style>