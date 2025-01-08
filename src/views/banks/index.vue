<template>
  <div class="card-grid">
    <div class="card-item" v-for="(card, index) in cards" :key="index">
      <el-card shadow="hover" class="card-content" @click="goToPage(card.link)">
        <div class="card-details">
          <h3>{{ card.title }}</h3>
          <p>{{ card.description }}</p>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
// 定义卡片数据
const cards = [
  {
    title: "Java 热门面试题 200 道",
    description: "2024 最新 Java 热门面试题...",
    icon: "icon-java.png", // 图标文件名
    link: "/java-popular",
  },
  {
    title: "Java 基础面试题",
    description: "Java 作为广泛应用的编程语言...",
    icon: "icon-java-basics.png",
    link: "/java-basics",
  },
  {
    title: "Java 集合面试题",
    description: "Java 集合框架是后端开发的基础...",
    icon: "icon-java-collection.png",
    link: "/java-collection",
  },
  {
    title: "Java 并发面试题",
    description: "Java 并发编程是高性能应用开发的关键...",
    icon: "icon-java-concurrency.png",
    link: "/java-concurrency",
  },
  // 添加更多卡片数据
];

// // 动态生成图标路径
// const getIconPath = (icon) => {
//   return new URL(`../assets/${icon}`, import.meta.url).href;
// };

// 点击跳转到指定页面
const goToPage = (link) => {
  console.log(`Navigating to: ${link}`);
  // 可以替换为 Vue Router 的跳转逻辑
  // this.$router.push(link); 如果用 Vue Router
};

</script>

<style scoped>
/* 网格布局容器 */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); /* 动态列数 */
  gap: 20px; /* 卡片之间的间距 */
  padding: 20px;
  background-color: #f5f5f5;
}

/* 单个卡片样式 */
.card-item {
  display: flex;
  justify-content: center;
}

/* 卡片内容样式 */
.card-content {
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.card-content:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.card-icon {
  width: 50px;
  height: 50px;
  margin-bottom: 10px;
}

.card-details h3 {
  font-size: 16px;
  margin: 0;
  color: #333;
}

.card-details p {
  font-size: 14px;
  color: #666;
  margin: 5px 0 0;
}
</style>