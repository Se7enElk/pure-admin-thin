/*
 * @Author: Elk
 * @Date: 2025-01-03 18:51:18
 * @FilePath: /lemon9-admin/src/utils/auth.ts
 * @Description: 用户信息
 */
import { useUserStoreHook } from "@/store/modules/user";
import { storageLocal, isString, isIncludeAllChildren } from "@pureadmin/utils";

export interface TokenInfo {
    /** token */
    accessToken: string;
}

export interface DataInfo {
    /** token */
    accessToken: string;
    /** 头像 */
    avatar?: string;
    /** 用户名 */
    user_name?: string;
    /** 昵称 */
    nick_name?: string;
    /** 当前登录用户的角色 */
    roles?: Array<string>;
    /** 当前登录用户的按钮级别权限 */
    permissions?: Array<string>;
}

export const userKey = "user-info";
export const TokenKey = "authorized-token";

/** 获取`token` */
export function getToken(): TokenInfo {
    // 此处与`TokenKey`相同，此写法解决初始化时`Cookies`中不存在`TokenKey`报错
    return storageLocal().getItem(TokenKey);
}

/**
 * @description 设置`token`以及一些必要信息并采用无感刷新`token`方案
 * 无感刷新：后端返回`accessToken`（访问接口使用的`token`）、`refreshToken`（用于调用刷新`accessToken`的接口时所需的`token`，`refreshToken`的过期时间（比如30天）应大于`accessToken`的过期时间（比如2小时））、`expires`（`accessToken`的过期时间）
 * 将`accessToken`、`expires`、`refreshToken`这三条信息放在key值为authorized-token的cookie里（过期自动销毁）
 * 将`avatar`、`username`、`nickname`、`roles`、`permissions`、`refreshToken`、`expires`这七条信息放在key值为`user-info`的localStorage里
 */
export async function setToken(data: DataInfo) {
    const { accessToken } = data;
    storageLocal().setItem(TokenKey, { accessToken });
}

/** 删除`token`以及key值为`user-info`的localStorage信息 */
export function removeToken() {
    storageLocal().removeItem(userKey);
    storageLocal().removeItem(TokenKey);
}

/** 是否有按钮级别的权限（根据登录接口返回的`permissions`字段进行判断）*/
export const hasPerms = (value: string | Array<string>): boolean => {
    if (!value) return false;
    const allPerms = "*:*:*";
    const { permissions } = useUserStoreHook();
    if (!permissions) return false;
    if (permissions.length === 1 && permissions[0] === allPerms) return true;
    const isAuths = isString(value)
        ? permissions.includes(value)
        : isIncludeAllChildren(value, permissions);
    return isAuths ? true : false;
};
