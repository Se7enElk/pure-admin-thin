/*
 * @Author: Elk
 * @Date: 2025-01-02 16:44:17
 * @FilePath: /lemon9-admin/src/store/modules/user.ts
 * @Description: 用户信息
 */
import { defineStore } from "pinia";
import {
    type userType,
    store,
    // router,
    // resetRouter,
    // routerArrays,
    storageLocal
} from "../utils";
import {
    type UserResult,
    getLogin,
    type UserInfoResult,
    getUserInfo,
    type OptionsResult,
    getOptions
} from "@/api/user";
// import { useMultiTagsStoreHook } from "./multiTags";
import { type DataInfo, setToken, removeToken, userKey } from "@/utils/auth";

export const useUserStore = defineStore("pure-user", {
    state: (): userType => ({
        // 头像
        avatar: storageLocal().getItem<DataInfo>(userKey)?.avatar ?? "",
        // 用户名
        user_name: storageLocal().getItem<DataInfo>(userKey)?.user_name ?? "",
        // 昵称
        nick_name: storageLocal().getItem<DataInfo>(userKey)?.nick_name ?? "",
        // 页面级别权限
        roles: storageLocal().getItem<DataInfo>(userKey)?.roles ?? [],
        // 按钮级别权限
        permissions:
            storageLocal().getItem<DataInfo>(userKey)?.permissions ?? [],
        // 判断登录页面显示哪个组件（0：登录（默认）、1：手机登录、2：二维码登录、3：注册、4：忘记密码）
        currentPage: 0,
        // 是否勾选了登录页的免登录
        isRemembered: false,
        // 登录页的免登录存储几天，默认7天
        loginDay: 7,
        // 用户选项
        options: {}
    }),
    actions: {
        /** 存储头像 */
        SET_AVATAR(avatar: string) {
            this.avatar = avatar;
        },
        /** 存储用户名 */
        SET_USERNAME(user_name: string) {
            this.user_name = user_name;
        },
        /** 存储昵称 */
        SET_NICKNAME(nick_name: string) {
            this.nick_name = nick_name;
        },
        /** 存储角色 */
        SET_ROLES(roles: Array<string>) {
            this.roles = roles;
        },
        /** 存储按钮级别权限 */
        SET_PERMS(permissions: Array<string>) {
            this.permissions = permissions;
        },
        /** 存储登录页面显示哪个组件 */
        SET_CURRENTPAGE(value: number) {
            this.currentPage = value;
        },
        /** 存储是否勾选了登录页的免登录 */
        SET_ISREMEMBERED(bool: boolean) {
            this.isRemembered = bool;
        },
        /** 设置登录页的免登录存储几天 */
        SET_LOGINDAY(value: number) {
            this.loginDay = Number(value);
        },
        /** 存储用户选项 */
        SET_OPTIONS(options: Array<any>) {
            this.options = options;
        },
        /** 获取用户选项 */
        async getOptions() {
            return new Promise<OptionsResult>((resolve, reject) => {
                getOptions()
                    .then(data => {
                        resolve(data);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
        /** 登入 */
        async loginByUsername(data) {
            return new Promise<UserResult>((resolve, reject) => {
                getLogin(data)
                    .then(data => {
                        if (data?.success) setToken(data.data);
                        resolve(data);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
        /** 获取用户信息 */
        async getUserInfo() {
            return new Promise<UserInfoResult>((resolve, reject) => {
                getUserInfo()
                    .then(data => {
                        resolve(data);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
        /** 前端登出 */
        async logOut() {
            try {
                // 先移除 token，避免状态更新触发其他副作用
                removeToken();
                // 构建登出 URL 并重定向
                const baseUrl = import.meta.env.VITE_BASE_URL;
                const logoutUrl = `${baseUrl}/backend/logout`;
                const redirectUrl = encodeURIComponent(window.location.origin);
                window.location.href = `${logoutUrl}?service=${redirectUrl}`;
            } catch (error) {
                console.error("登出过程发生错误:", error);
                throw error;
            }
        },
        /** 获取指定枚举类型的选项列表 */
        getEnumOptions(
            enumName: string
        ): Array<{ name: string; value: string }> {
            return (this.options as any)[enumName] || [];
        },
        /** 根据枚举名称和值获取对应的显示名称 */
        getEnumNameByValue(enumName: string, value: string): string {
            const options = (this.options as any)[enumName] || [];
            const found = options.find(item => item.value === value);
            return found ? found.name : "";
        }
    }
});

export function useUserStoreHook() {
    return useUserStore(store);
}
