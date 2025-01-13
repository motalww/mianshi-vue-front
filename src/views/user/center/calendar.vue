<template>
  <div class="calendar-chart">
    <a-spin v-if="loading" size="large" tip="正在加载刷题签到记录..." />
    <div v-else>
      <div ref="chartRef" class="chart-container" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue';
import * as echarts from 'echarts';
import dayjs from 'dayjs';
import { getUserSignInRecordUsingGet } from '@/api/userController';
import { ElMessage } from 'element-plus';

// 图表容器引用
const chartRef = ref<HTMLDivElement | null>(null);

// 加载状态
const loading = ref(true);

// 当前年份
const year = new Date().getFullYear();

// 签到日期列表（[1, 200]，表示第 1 和第 200 天有签到记录）
const dataList = ref<number[]>([]);

// 请求后端获取数据
const fetchDataList = async () => {
  try {
    const res = await getUserSignInRecordUsingGet({ year });
    dataList.value = res.data;
    loading.value = false;
    renderChart();
  } catch (e: any) {
    ElMessage.error('获取刷题签到记录失败，' + e.message);
    loading.value = false;
  }
};

// 计算图表所需的数据
const optionsData = computed(() => {
  return dataList.value.map((dayOfYear) => {
    const dateStr = dayjs(`${year}-01-01`)
        .add(dayOfYear - 1, 'day')
        .format('YYYY-MM-DD');
    return [dateStr, 1];
  });
});

// 图表配置
const options = computed(() => ({
  visualMap: {
    show: false,
    min: 0,
    max: 1,
    inRange: {
      color: ['#efefef', 'lightgreen'], // 颜色从灰色到浅绿色
    },
  },
  calendar: {
    range: year,
    left: 20,
    cellSize: ['auto', 16], // 单元格自动宽度，高度为 16 像素
    yearLabel: {
      position: 'top',
      formatter: `${year} 年刷题记录`,
    },
  },
  series: {
    type: 'heatmap',
    coordinateSystem: 'calendar',
    data: optionsData.value,
  },
}));

// 初始化 ECharts
const renderChart = () => {
  nextTick(() => {
    if (chartRef.value) {
      const myChart = echarts.init(chartRef.value);
      myChart.setOption(options.value);
    } else {
      console.error('chartRef is not defined or mounted properly.');
    }
  });
};

// 页面挂载时加载数据
onMounted(() => {
  fetchDataList();
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px; /* 根据需求调整高度 */
}
</style>
