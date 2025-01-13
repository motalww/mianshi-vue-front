<template>
  <div id="userLoginPage">
    <a-card class="login-card">
      <div class="login-header">
        <a-img
            src="/logo.svg"
            alt="面试平台"
            class="login-logo"
        />
        <h2>面试平台 - 用户登录</h2>
        <p>程序员面试刷题网站</p>
      </div>

      <!-- 登录表单 -->
      <a-form
          :model="loginForm"
          :rules="rules"
          ref="loginFormRef"
          class="login-form"
      >
        <!-- 用户账号 -->
        <a-form-item label="账号" name="userAccount">
          <a-input
              v-model:value="loginForm.userAccount"
              placeholder="请输入用户账号"
              size="large"
          >
            <template #prefix>
              <UserOutlined />
            </template>
          </a-input>
        </a-form-item>

        <!-- 用户密码 -->
        <a-form-item label="密码" name="userPassword">
          <a-input
              v-model:value="loginForm.userPassword"
              type="password"
              placeholder="请输入密码"
              size="large"
          >
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input>
        </a-form-item>

        <!-- 登录按钮 -->
        <a-form-item style="width: 100%; text-align: center;">
          <a-button
              type="primary"
              size="middle"
              @click="doLogin"
              :loading="loading"
              style="width: 100px"
          >
            登录
          </a-button>
        </a-form-item>
      </a-form>

      <div class="login-footer">
        <span>还没有账号？</span>
        <a-link href="/user/register" type="primary">去注册</a-link>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {useRouter} from "vue-router";
import {message} from "ant-design-vue";
import {userLoginUsingPost} from "@/api/userController.ts"; // 后端 API
import {useUserStore} from "@/stores/user.ts"; // Pinia 用户 Store
import {UserOutlined, LockOutlined} from "@ant-design/icons-vue";

const router = useRouter(); // Vue Router
const userStore = useUserStore(); // Pinia Store

// 登录表单数据
const loginForm = reactive({
  userAccount: "",
  userPassword: "",
});

// 表单验证规则
const rules = {
  userAccount: [
    {required: true, message: "请输入用户账号", trigger: "blur"},
  ],
  userPassword: [
    {required: true, message: "请输入密码", trigger: "blur"},
  ],
};

// 表单引用
const loginFormRef = ref(null);

// 登录按钮加载状态
const loading = ref(false);

// 登录方法
const doLogin = async () => {
  if (!loginFormRef.value) return;

  try {
    const isValid = await loginFormRef.value.validate();
    if (!isValid) {
      message.error("请正确填写表单信息");
      return;
    }

    loading.value = true;
    // 调用后端登录 API
    const res = await userLoginUsingPost(loginForm);

    if (res && res.data) {
      message.success("登录成功");
      // 保存用户信息到 Pinia
      userStore.setUserInfo(res.data);

      // 跳转到首页
      await router.replace("/");
    } else {
      message.error(res.message || "登录失败");
    }
  } catch (error) {
    message.error("登录失败，请稍后重试");
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
#userLoginPage {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70vh;
  background-color: #f5f5f5;
}

.login-card {
  width: 500px;
  padding: 20px;
  border-radius: 9px;
}

.login-header {
  text-align: center;
  margin-bottom: 20px;
}

.login-logo {
  width: 150px;
  height: 50px;
  margin-bottom: 10px;
}

.login-form {
  margin-top: 20px;
}

.login-footer {
  text-align: center;
  margin-top: 20px;
}
</style>
