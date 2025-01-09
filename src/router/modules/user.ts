/*
 * @Author: Elk
 * @Date: 2025-01-04 15:34:53
 * @FilePath: /lemon9-admin/src/router/modules/user.ts
 * @Description: 用户路由
 */
// import { $t } from "@/plugins/i18n";

export default {
    path: "/user",
    redirect: "/user/manage",
    meta: {
        icon: "ri:table-line",
        title: "用户管理",
        rank: 7
    },
    children: [
        {
            path: "/user/manage",
            name: "UserManage",
            component: () => import("@/views/user/manage/index.vue"),
            meta: {
                title: "用户管理"
            }
        },
        {
            path: "/user/detail",
            name: "UserDetail",
            component: () => import("@/views/user/detail/index.vue"),
            meta: {
                title: "用户详情"
            }
        },
        {
            path: "/user/recharge",
            name: "UserRecharge",
            component: () => import("@/views/user/recharge/index.vue"),
            meta: {
                title: "充值记录"
            }
        }
    ]
} satisfies RouteConfigsTable;
