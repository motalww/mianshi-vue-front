// 菜单列表
import type {RouteRecordRaw} from "vue-router";

export const menus: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "主页",
        meta: {
            title: "主页",
        },
        component: () => import("@/views/HomeView.vue"), // 懒加载组件
    },
    {
        path: "/banks",
        name: "题库",
        meta: {
            title: "题库",
        },
        component: () => import("@/views/banks/index.vue")
    },
    {
        path: '/banks/:bankId', // 动态路由，`:id` 是动态参数
        name: 'BankDetails',
        component: ()=>import("@/views/banks/detail.vue"), // 显示银行详细信息
        props: true, // 将路由参数作为组件的 props
    },
    {
        path: "/questions",
        name: "题目",
        meta: {
            title: "题目",
        },
        component: () => import("@/views/questions/index.vue")
    },
    {
        path: "/user",
        name: "用户",
        meta: {
            title: "用户",
        },
        children:[
            {
                path: "/user/login",
                name: "登录",
                meta: {
                    title: "登录",
                },
                component:()=>import("@/views/user/login/login.vue")
            }
        ]
    },
    {
        path: "/admin",
        name: "管理",
        meta: {
            title: "管理",
            icon: "el-icon-crown", // 使用 Element Plus 图标
            access: "admin", // 权限枚举
        },
        children: [
            {
                path: "/admin/user",
                name: "用户管理",
                meta: {
                    title: "用户管理",
                    access: "admin", // 权限枚举
                },
            },
        ]
    }
];
