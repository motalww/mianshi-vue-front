import { defineStore } from "pinia";
import {getLoginUserUsingGet, userLoginUsingPost} from "@/api/userController.ts";

// 定义用户信息的接口类型
interface User {
    userName: string; // 用户名
    userAvatar: string; // 用户头像地址
}

// 定义 Store
export const useUserStore = defineStore("user", {
    // 定义状态
    state: (): { user: User } => ({
        user: {
            userName: "未登录", // 默认用户名
            userAvatar: "", // 默认头像地址
        },
    }),

    // 定义行为（Actions）
    actions: {
        // 设置用户信息
        setUserInfo(userInfo: User) {
            this.user = userInfo;
        },

        // 清除用户信息（如退出登录）
        clearUserInfo() {
            this.user = {
                name: "未登录",
                avatar: "",
            };
        },

        async fetchUserInfo() {
            try {
                const res = await getLoginUserUsingGet(); // 假设后端接口为 /api/user
                this.setUserInfo(res.data); // 设置用户信息到 Pinia
            } catch (error) {
                console.error("获取用户信息失败：", error);
                // 可以根据需要处理错误，例如显示提示或跳转到登录页
            }
        },
    },
    // 启用持久化，默认保存到 localStorage
    persist: true,
});
