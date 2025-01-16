<template>
  <div>
    <a-card>
      <a-form
          ref="formRef"
          name="advanced_search"
          class="ant-advanced-search-form"
          :model="formState"
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
                  v-model="questionQueryRequest[field.name]"
                  :placeholder="field.placeholder"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24" style="text-align: right">
            <a-button type="primary" html-type="submit">Search</a-button>
            <a-button style="margin: 0 8px" @click="clearForm">Clear</a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
  </div>
  <div>
    <a-card title="题目管理">
      <a-table :columns="columns" :data-source="data" :pagination="false" :scroll="{ x: 2000}">
        <template #bodyCell="{ column,record  }">
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
          <template v-if="column.key === 'userAvatar'">
            <a-avatar :src="record.userAvatar"/>
          </template>
          <template v-if="column.key === 'userRole'">
            <a-tag color="blue">{{ record.userRole }}</a-tag>
          </template>
          <template v-else-if="column.key === 'tags'">
            <span>
              <a-tag v-for="(tag, index) in JSON.parse(record.tags)" :key="index">
              {{ tag}}
            </a-tag>
            </span>
          </template>
        </template>
      </a-table>
      <a-pagination
          v-model:current="current"
          v-model:total="total"
          :show-total="total => `共 ${total} 条`"
          style="text-align: center">
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
import {onMounted, reactive, ref} from 'vue';
import Edit from "@/views/admin/user/edit.vue";
import {message, type TableColumnsType} from "ant-design-vue";
import {deleteUserUsingPost} from "@/api/userController.ts";
import {listQuestionByPageUsingPost} from "@/api/questionController.ts";

const columns: TableColumnsType = [
  {title: '题目', width: 100, dataIndex: 'title', key: 'title', width: 200},
  {title: '内容', width: 100, dataIndex: 'content', key: 'content',},
  {title: '答案', dataIndex: 'answer', key: 'answer', ellipsis: true, width: 300},
  {title: '标签', dataIndex: 'tags', key: 'tags', width: 150},
  {title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 150},
  {title: '更新时间', dataIndex: 'updateTime', key: 'updateTime', width: 200},
  {title: '修改时间', dataIndex: 'editTime', key: 'editTime', width: 200},
  {title: '是否需要VIP', dataIndex: 'needVip', key: 'needVip', width: 150},
  {title: '浏览数量', dataIndex: 'viewNum', key: 'viewNum', width: 150},
  {title: '点赞数量', dataIndex: 'thumbNum', key: 'thumbNum', width: 150},
  {title: '收藏数量', dataIndex: 'favourNum', key: 'favourNum', width: 150},
  {
    title: '操作',
    key: 'operation',
    fixed: 'right',
    width: 200,
    align: "center"
  },
];

interface DataItem {
  key: number;
  userName: string;
  age: number;
  address: string;
}

const data: DataItem[] = ref([]);
onMounted(() => {
  getUserList()
})

// 表单状态
const questionQueryRequest: API.QuestionQueryRequest = reactive({
  answer: '',
  content: '',
  // current: '',
  id: '',
  notId: '',
  // pageSize: '',
  questionBankId: '',
  searchText: '',
  sortField: '',
  sortOrder: '',
  // tags: '',
  title: '',
  userId: '',
});


const current = ref(1);
const total = ref(0)
const getUserList = async () => {
  try {
    const res = await listQuestionByPageUsingPost(questionQueryRequest)
    if (res.code === 0) {
      console.log(res.data)
      data.value = res.data.records
      total.value = res.data.total
      console.log(res.data.records)
    }
  } catch (error) {
    message.error(error.message)
  }
}
const editModal = ref(false)
const showEditModal = async (userInfo) => {
  editModal.value = true
  console.log(userInfo)
}
const onDelete = async (id) => {
  try {
    const deleteRequest: API.DeleteRequest = {
      id: id
    }
    const res = await deleteUserUsingPost(deleteRequest)
    if (res.code === 0) {
      message.success('删除成功')
      await getUserList()
    }
  } catch (error) {
    message.error(error.message)
  }
}
// 表单字段定义
const fields = [
  {
    name: '账户',
    label: '账户',
    rules: [{required: true, message: '请输入账户'}],
    placeholder: '请输入账户',
  },
  {
    name: '用户名',
    label: '用户名',
    rules: [{required: true, message: '请输入用户名'}],
    placeholder: '请输入用户名',
  },
  {
    name: 'field3',
    label: '字段3',
    rules: [{required: true, message: '请输入字段3'}],
    placeholder: '请输入字段3',
  },
  {
    name: 'field4',
    label: '字段4',
    rules: [{required: true, message: '请输入字段4'}],
    placeholder: '请输入字段4',
  },
];


// 表单提交处理
const onFinish = (values: any) => {
  console.log('Received values of form: ', values);
};

// 清空表单字段
const clearForm = () => {
  fields.value?.resetFields();
};


</script>

