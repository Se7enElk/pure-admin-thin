/*
 * @Author: Elk
 * @Date: 2025-01-04 15:34:53
 * @FilePath: /lemon9-admin/src/router/modules/application.ts
 * @Description: 应用路由
 */
// import { $t } from "@/plugins/i18n";

export default {
    path: "/user",
    redirect: "/application/launch",
    meta: {
        icon: "ri:table-line",
        title: "应用管理",
        rank: 8
    },
    children: [
        {
            path: "/application/launch",
            name: "ApplicationLaunch",
            component: () => import("@/views/application/launch/index.vue"),
            meta: {
                showParent: true,
                title: "投放管理"
            }
        }
    ]
} satisfies RouteConfigsTable;
