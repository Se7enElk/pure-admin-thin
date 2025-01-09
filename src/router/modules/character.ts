/*
 * @Author: Elk
 * @Date: 2025-01-04 15:34:53
 * @FilePath: /lemon9-admin/src/router/modules/character.ts
 * @Description: 角色路由
 */
// import { $t } from "@/plugins/i18n";

export default {
    path: "/user",
    redirect: "/character/manage",
    meta: {
        icon: "ri:table-line",
        title: "角色管理",
        rank: 8
    },
    children: [
        {
            path: "/character/manage",
            name: "CharacterManage",
            component: () => import("@/views/character/manage/index.vue"),
            meta: {
                title: "角色管理"
            }
        },
        {
            path: "/character/detail",
            name: "CharacterDetail",
            component: () => import("@/views/character/detail/index.vue"),
            meta: {
                title: "角色详情"
            }
        }
    ]
} satisfies RouteConfigsTable;
