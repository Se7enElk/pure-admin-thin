<!--
 * @Author: Elk
 * @Date: 2025-01-03 16:19:48
 * @FilePath: /lemon9-admin/src/App.vue
 * @Description: App.vue
-->
<template>
    <el-config-provider :locale="currentLocale">
        <div v-if="isLoading">
            <el-loading full-screen />
        </div>
        <template v-else>
            <router-view />
            <ReDialog />
            <ReDrawer />
        </template>
    </el-config-provider>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { checkVersion } from "version-rocket";
import { ElConfigProvider } from "element-plus";
import { ReDialog } from "@/components/ReDialog";
import { ReDrawer } from "@/components/ReDrawer";
import en from "element-plus/es/locale/lang/en";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import plusEn from "plus-pro-components/es/locale/lang/en";
import plusZhCn from "plus-pro-components/es/locale/lang/zh-cn";
import { useUserStoreHook } from "@/store/modules/user";
import { getToken } from "@/utils/auth";
export default defineComponent({
    name: "app",
    components: {
        [ElConfigProvider.name]: ElConfigProvider,
        ReDialog,
        ReDrawer
    },
    data() {
        return {
            isLoading: true
        };
    },
    computed: {
        currentLocale() {
            return this.$storage.locale?.locale === "zh"
                ? { ...zhCn, ...plusZhCn }
                : { ...en, ...plusEn };
        }
    },
    beforeCreate() {
        // const { version, name: title } = __APP_INFO__.pkg;
        // const { VITE_PUBLIC_PATH, MODE } = import.meta.env;
        // // https://github.com/guMcrey/version-rocket/blob/main/README.zh-CN.md#api
        // if (MODE === "production") {
        //     // 版本实时更新检测，只作用于线上环境
        //     checkVersion(
        //         // config
        //         {
        //             // 5分钟检测一次版本
        //             pollingTime: 300000,
        //             localPackageVersion: version,
        //             originVersionFileUrl: `${location.origin}${VITE_PUBLIC_PATH}version.json`
        //         },
        //         // options
        //         {
        //             title,
        //             description: "检测到新版本",
        //             buttonText: "立即更新"
        //         }
        //     );
        // }
    },
    async created() {
        try {
            if (getToken()) {
                const res = await useUserStoreHook().getOptions();
                if (res.status === 200) {
                    useUserStoreHook().SET_OPTIONS(res.data);
                }
            }
        } finally {
            this.isLoading = false;
        }
    }
});
</script>
