<template>
  <div>
    <a-card>
      <a-form
          ref="formRef"
          name="advanced_search"
          class="ant-advanced-search-form"
          :model="userQueryRequest"
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
                  v-model:value="userQueryRequest[field.name]"
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
    <a-card title="用户管理">
      <a-table :columns="columns" :data-source="data" :pagination="false" :scroll="{ x: 2000}">
        <template #bodyCell="{ column,record  }">
          <template v-if="column.key === 'operation'">
            <a @click="showEditModal(record)">修改</a>
            <a-popconfirm
                v-if="data.length"
                title="确定删除此用户 ?"
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
        </template>
      </a-table>
      <a-pagination
          v-model:current="current"
          v-model:total="total"
          v-model:pageSize="pageSize"
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
        title="编辑用户"
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
import Edit from "@/views/admin/user/edit.vue";
import {message, type TableColumnsType} from "ant-design-vue";
import {deleteUserUsingPost, listUserByPageUsingPost} from "@/api/userController.ts";
import UserQueryRequest = API.UserQueryRequest;

const columns: TableColumnsType = [
  {title: '账户', width: 100, dataIndex: 'userAccount', key: 'userAccount',},
  {title: '用户名', width: 100, dataIndex: 'userName', key: 'userName',},
  {title: '头像', dataIndex: 'userAvatar', key: 'userAvatar', width: 150},
  {title: '角色', dataIndex: 'userRole', key: 'userRole', width: 150},
  {title: '简介', dataIndex: 'userProfile', key: 'userProfile', width: 150},
  {title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 200},
  {title: '修改时间', dataIndex: 'updateTime', key: 'updateTime', width: 200},
  {title: 'VIP编号', dataIndex: 'vipNumber', key: 'vipNumber', width: 150},
  {title: 'VIP兑换码', dataIndex: 'vipCode', key: 'vipCode', width: 150},
  {title: 'VIP到期时间', dataIndex: 'vipExpireTime', key: 'vipExpireTime', width: 150},
  {title: '开放平台id', dataIndex: 'mpOpenId', key: 'mpOpenId', width: 150},
  {title: '公众号openId', dataIndex: 'unionId', key: 'unionId', width: 150},
  {
    title: '操作',
    key: 'operation',
    fixed: 'right',
    width: 200,
    align: "center"
  },
];

const current = ref<number>(1);    // 使用 `ref<number>`
const pageSize = ref<number>(20);
const total = ref<number>(0);

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

const userQueryRequest: UserQueryRequest = reactive({
  current: current.value,
  id: '',
  userAccount:'',
  mpOpenId: '',
  pageSize: pageSize.value,
  sortField: '',
  sortOrder: '',
  unionId: '',
  userName: '',
  userProfile: '',
  userRole: '',
})

const search = async () => {
  await getUserList()
}

const getUserList = async () => {
  try {
    const res = await listUserByPageUsingPost(userQueryRequest)
    if (res.code === 0) {
      data.value = res.data.records
      total.value = Number(res.data.total);  // 确保 total 是数字
    }
  } catch (error) {
    message.error(error.message)
  }
}

watch([current, pageSize], () => {
  userQueryRequest.current = current;
  userQueryRequest.pageSize = pageSize;
  getUserList()
});


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
    name: 'id',
    label: 'ID',
    placeholder: '请输入ID',
  },
    {
    name:'mpOpenId',
    label: 'OpenId',
    placeholder: '请输入OpenId',
  },
    {
    name: 'unionId',
    label: 'UnionId',
    placeholder: '请输入UnionId',
  },
  {
    name: 'userAccount',
    label: '账户',
    placeholder: '请输入账户',
  },
  {
    name: 'userName',
    label: '用户名',
    placeholder: '请输入用户名',
  },
  {
    name: 'userProfile',
    label: '用户简介',
    placeholder: '请输入用户简介',
  },
  {
    name: 'userRole',
    label: '用户角色',
    placeholder: '请输入用户角色',
  },
];

const formRef = ref();
const clearForm = () => {
  formRef.value?.resetFields();
};


</script>

