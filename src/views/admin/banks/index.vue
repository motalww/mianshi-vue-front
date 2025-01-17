<template>
  <div>
    <a-card>
      <a-form
          ref="formRef"
          name="advanced_search"
          class="ant-advanced-search-form"
          :model="questionBankQueryRequest"
          @finish="onFinish"
      >
        <a-row :gutter="24">
          <a-col :span="6" v-for="(field, index) in fields" :key="index">
            <!-- 动态生成表单项 -->
            <a-form-item
                :name="field.name"
                :label="field.label"
                :rules="field.rules"
            >
              <a-input
                  v-model:value="questionBankQueryRequest[field.name]"
                  :placeholder="field.placeholder"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24" style="text-align: right">
            <a-button type="primary" @click="search()">Search</a-button>
            <a-button style="margin: 0 8px" @click="clearForm">Clear</a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
  </div>

  <div>
    <a-card title="题目管理">
      <a-table :columns="columns" :data-source="data" :pagination="false" :scroll="{ x: 2000}">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'operation'">
            <a @click="showEditModal(record)">修改</a>
            <a-popconfirm
                v-if="data.length"
                title="确定删除此题目 ?"
                @confirm="onDelete(record.id)"
            >
              <a style="margin-left: 10px;">删除</a>
            </a-popconfirm>
          </template>
          <template v-if="column.key === 'picture'">
            <a-image :src="record.picture" style="width: 60px"/>
          </template>
        </template>
      </a-table>

      <!-- 分页组件 -->
      <a-pagination
          v-model:current="current"
          v-model:total="total"
          v-model:pageSize="pageSize"
          :show-total="total => `共 ${total} 条`"
          style="text-align: center"
          show-size-changer
          @change="handlePageChange"
      >
        <template #itemRender="{ type, originalElement }">
          <a v-if="type === 'prev'">上一页</a>
          <a v-else-if="type === 'next'">下一页</a>
          <component :is="originalElement" v-else></component>
        </template>
      </a-pagination>
    </a-card>
  </div>

  <div>
    <a-modal
        v-model:open="editModal"
        title="编辑题目"
        centered
        @ok="editModal = false"
        style="width: 50%"
    >
      <edit/>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref, watch} from 'vue';
import {type FormInstance, message, type TableColumnsType} from "ant-design-vue";
import {deleteUserUsingPost} from "@/api/userController.ts";
import {listQuestionBankByPageUsingPost} from "@/api/questionBankController.ts";
import Edit from "@/views/admin/user/edit.vue";

const columns: TableColumnsType = [
  {title: '标题', dataIndex: 'title', key: 'title', width: 150},
  {title: '描述', dataIndex: 'description', key: 'description', width: 150},
  {title: '答案', dataIndex: 'picture', key: 'picture', ellipsis: true, width: 300},
  {title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 150},
  {title: '更新时间', dataIndex: 'updateTime', key: 'updateTime', width: 200},
  {title: '修改时间', dataIndex: 'editTime', key: 'editTime', width: 200},
  {title: '浏览数量', dataIndex: 'viewNum', key: 'viewNum', width: 150},
  {title: '优先级', dataIndex: 'priority', key: 'priority', width: 150},
  {
    title: '操作',
    key: 'operation',
    fixed: 'right',
    width: 200,
    align: "center"
  },
];

const data: DataItem[] = ref([]);
onMounted(() => {
  getBankList()
})
const current = ref<number>(1);    // 使用 `ref<number>`
const pageSize = ref<number>(20);
const total = ref<number>(0);

// 表单状态
const questionBankQueryRequest: API.QuestionBankQueryRequest = reactive({
  id:'',
  title: '',
  description: '',
  userId: '',
  current: current.value,
  pageSize: pageSize.value,
});

watch([current, pageSize], () => {
  questionBankQueryRequest.current = current;
  questionBankQueryRequest.pageSize = pageSize;
  getBankList()
});

// 获取数据
const getBankList = async () => {
  try {
    const res = await listQuestionBankByPageUsingPost(questionBankQueryRequest)
    if (res.code === 0) {
      data.value = res.data.records;
      total.value = res.data.total;
    }
  } catch (error) {
    message.error(error.message)
  }
}

// 查询按钮
const search = async () => {
  await getBankList()
}
const formRef = ref<FormInstance>();
// 清空表单
const clearForm = () => {
  console.log(formRef)
  formRef?.value.resetFields();
}

// 分页处理
const handlePageChange = async (page: number) => {
  current.value = page;
  await getBankList()
}

// 编辑模态框
const editModal = ref(false);
const showEditModal = (record: any) => {
  editModal.value = true;
};

// 删除操作
const onDelete = async (id: string) => {
  try {
    const res = await deleteUserUsingPost({id});
    if (res.code === 0) {
      message.success('删除成功');
      await getBankList();
    }
  } catch (error) {
    message.error(error.message);
  }
}

// 表单字段定义
const fields = reactive([
  {
    name: 'id',
    label: 'ID',
    placeholder: '请输入id',
  },
  {
    name: 'userId',
    label: 'userId',
    placeholder: '请输入userId',
  },
  {
    name: 'title',
    label: '标题',
    placeholder: '请输入标题',
  },
  {
    name: 'description',
    label: '描述',
    placeholder: '请输入描述',
  },

]);
</script>

<style scoped>
/* 样式调整 */
.ant-advanced-search-form {
  background-color: #fff;
  padding: 24px;
  border-radius: 8px;
}

.ant-form-item-label {
  font-weight: bold;
}

.ant-form-item {
  margin-bottom: 16px;
}

a-button {
  margin-right: 8px;
}
</style>
