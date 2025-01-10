<template>
  <div id="userLoginPage">
    <el-card class="login-card">
      <div class="login-header">
        <el-image
            src="/logo.svg"
            alt="面试平台"
            class="login-logo"
        />
        <h2>面试平台 - 用户登录</h2>
        <p>程序员面试刷题网站</p>
      </div>

      <!-- 登录表单 -->
      <el-form
          :model="loginForm"
          :rules="rules"
          ref="loginFormRef"
          label-width="100px"
          class="login-form"
      >
        <!-- 用户账号 -->
        <el-form-item label="账号" prop="userAccount">
          <el-input
              v-model="loginForm.userAccount"
              placeholder="请输入用户账号"
              prefix-icon="User"
              size="large"
          />
        </el-form-item>

        <!-- 用户密码 -->
        <el-form-item label="密码" prop="userPassword">
          <el-input
              v-model="loginForm.userPassword"
              type="password"
              placeholder="请输入密码"
              prefix-icon="Lock"
              size="large"
              show-password
          />
        </el-form-item>

        <!-- 登录按钮 -->
        <el-form-item style="width: 100%; text-align: center;">
          <el-button
              type="primary"
              size="default"
              @click="doLogin"
              :loading="loading"
              style="margin-left: 25%;width: 100px"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>

      <div class="login-footer">
        <span>还没有账号？</span>
        <el-link href="/user/register" type="primary">去注册</el-link>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { userLoginUsingPost } from "@/api/userController.ts"; // 后端 API
import { useUserStore } from "@/stores/user.ts"; // Pinia 用户 Store

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
    { required: true, message: "请输入用户账号", trigger: "blur" },
  ],
  userPassword: [
    { required: true, message: "请输入密码", trigger: "blur" },
  ],
};

// 表单引用
const loginFormRef = ref(null);

// 登录按钮加载状态
const loading = ref(false);

// 登录方法
const doLogin = async () => {
  if (!loginFormRef.value) return;

  loginFormRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      ElMessage.error("请正确填写表单信息");
      return;
    }

    loading.value = true;
    try {
      // 调用后端登录 API
      const res = await userLoginUsingPost(loginForm);

      if (res && res.data) {
        ElMessage.success("登录成功");
        // 保存用户信息到 Pinia
        userStore.setUserInfo(res.data);

        // 跳转到首页
        await router.replace("/");
      } else {
        ElMessage.error(res.message || "登录失败");
      }
    } catch (error) {
      ElMessage.error("登录失败，请稍后重试");
      console.error(error);
    } finally {
      loading.value = false;
    }
  });
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
  width: 480px;
  padding: 20px;
  border-radius: 5px;
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
