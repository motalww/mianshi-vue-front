<template>
  <a-button class="editable-add-btn" style="margin-bottom: 8px" type="primary" @click="showAddModal">添加题目</a-button>
  <a-modal
      v-model:open="addModal"
      title="添加题目"
      centered
      style="width: 50%"
  >
    <a-form
        ref="formRef"
        :model="questionAddRequest"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        layout="horizontal"
        style="max-width: 600px"
    >
      <a-form-item label="标题">
        <a-input v-model:value="questionAddRequest.title" placeholder="请输入标题"/>
      </a-form-item>
      <a-form-item label="内容">
        <a-input v-model:value="questionAddRequest.content" placeholder="请输入内容"/>
      </a-form-item>
      <a-form-item label="答案">
        <a-textarea v-model:value="questionAddRequest.answer" placeholder="请输入答案" allow-clear/>
      </a-form-item>
      <a-form-item label="标签">
        <a-input v-model:value="questionAddRequest.tags" placeholder=" 请输入标签(多个使用','隔开) "
                 @blur="handleTagsInput"/>
      </a-form-item>
      <a-form-item label="是否需要VIP">
        <a-switch v-model:checked="questionAddRequest.needVip" checked-children="是" un-checked-children="否"/>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button key="back" @click="clearForm">取消</a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="confirmAddQuestion()">确定</a-button>
    </template>
  </a-modal>
</template>
<script lang="ts" setup>
import {reactive, ref} from 'vue';
import {addQuestionUsingPost} from "@/api/questionController.ts";
import { FormInstance, message} from "ant-design-vue";

const labelCol = {style: {width: '260px'}};
const wrapperCol = {span: 14};


// 定义触发的事件
const emit = defineEmits<{
  (event: 'refreshList'): void;
}>();

interface QuestionAddRequest {
  title: string;
  content: string;
  answer: string;
  tags: string[];
  needVip: number;
}

const addModal = ref(false)
const showAddModal = () => {
  addModal.value = true
}

const questionAddRequest = reactive<QuestionAddRequest>({
  title: '',
  content: '',
  answer: '',
  tags: [] as string[],  // 初始化为一个空的字符串数组
  needVip: '',
});

// 处理标签输入
const handleTagsInput = () => {
  // 如果标签输入框有内容
  if (questionAddRequest.tags) {
    // 将输入的标签按逗号分隔，并去除每个标签的前后空格
    questionAddRequest.tags = questionAddRequest.tags
        .split(',')
        .map(tag => tag.trim()) // 去除每个标签的前后空格
        .filter(tag => tag);    // 过滤掉空标签
  } else {
    // 如果没有标签输入，确保tags是空数组
    questionAddRequest.tags = [];
  }
};

const confirmAddQuestion = async () => {
  try {
    questionAddRequest.needVip = questionAddRequest.needVip === true ? 1 : 0
    console.log(questionAddRequest)
    const res = await addQuestionUsingPost(questionAddRequest)
    if (res.code === 0) {
      message.success("操作成功")
      emit('addSuccess');
      addModal.value = false
      clearForm()
    }
  } catch (error) {
    message.error(error.message)
  }
}
const formRef = ref()
const clearForm = () => {
  addModal.value = false
  // 重置表单数据
  questionAddRequest.title = '';
  questionAddRequest.content = '';
  questionAddRequest.answer = '';
  questionAddRequest.tags = [];
  questionAddRequest.needVip = 0; // 或者根据需要设置默认值
  // 重置表单字段
  formRef.value?.resetFields();
}

</script>

