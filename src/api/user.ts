/*
 * @Author: Elk
 * @Date: 2025-01-02 16:44:17
 * @FilePath: /lemon9-admin/src/api/user.ts
 * @Description: 用户相关接口
 */
import { http } from "@/utils/http";

type AnyResult = {
    success: boolean;
    data: any;
};

type SuccessResult = {
    success: boolean;
    status: number;
    message: string;
};

export type UserResult = {
    success: boolean;
    data: {
        /** 头像 */
        avatar: string;
        /** 用户名 */
        username: string;
        /** 昵称 */
        nickname: string;
        /** 当前登录用户的角色 */
        roles: Array<string>;
        /** 按钮级别权限 */
        permissions: Array<string>;
        /** `token` */
        accessToken: string;
        /** 用于调用刷新`accessToken`的接口时所需的`token` */
        refreshToken: string;
        /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
        expires: Date;
    };
};

export type RefreshTokenResult = {
    success: boolean;
    data: {
        /** `token` */
        accessToken: string;
        /** 用于调用刷新`accessToken`的接口时所需的`token` */
        refreshToken: string;
        /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
        expires: Date;
    };
};

export type UserInfo = {
    /** 头像 */
    avatar: string;
    /** 用户名 */
    user_name: string;
    /** 昵称 */
    nick_name: string;
    /** 邮箱 */
    email: string;
    /** 联系电话 */
    phone: string;
    /** 简介 */
    description: string;
    /** 权限 */
    permissions: Array<string>;
    /** 角色 */
    roles: Array<string>;
};

export type UserInfoResult = {
    success?: boolean;
    data: UserInfo;
    status: number;
};

type ResultTable = {
    success: boolean;
    status: number;
    data?: {
        /** 列表数据 */
        content: Array<any>;
        /** 总条目数 */
        total?: number;
        /** 总页数 */
        total_pages?: number;
        /** 每页显示条目个数 */
        page_size?: number;
        /** 当前页数 */
        page_index?: number;
    };
};

export type OptionsResult = {
    status: number;
    data: Array<any>;
};

export type FreeTimesResult = {
    status: number;
    data: any;
};

/** 登录 */
export const getLogin = (data?: object) => {
    return http.request<UserResult>("post", "/backend/admin/info", { data });
};

/** 获取用户信息 */
export const getUserInfo = (data?: object) => {
    return http.request<UserInfoResult>("get", "/backend/auth/user", { data });
};

/** 刷新`token` */
export const refreshTokenApi = (data?: object) => {
    return http.request<RefreshTokenResult>("post", "/refresh-token", { data });
};

/** 账户设置-个人信息 */
export const getMine = (data?: object) => {
    return http.request<UserInfoResult>("get", "/mine", { data });
};

/** 账户设置-个人安全日志 */
export const getMineLogs = (data?: object) => {
    return http.request<AnyResult>("get", "/mine-logs", { data });
};

/** 获取用户选项 */
export const getOptions = (data?: object) => {
    return http.request<OptionsResult>("get", "/backend/auth/options", {
        data
    });
};

/** 获取用户列表 */
export const getUserList = (params?: object) => {
    return http.request<ResultTable>("get", "/backend/auth/users", { params });
};

/** 添加特权次数 */
export const addFreeTimes = (data?: object) => {
    return http.request<FreeTimesResult>(
        "put",
        "/backend/auth/users/privileges",
        { data }
    );
};

/** 添加会员 */
export const addVip = (data?: object) => {
    return http.request<SuccessResult>("put", "/backend/auth/users/vip", {
        data
    });
};

/** 金币操作 */
export const coinOperation = (data?: object) => {
    return http.request<SuccessResult>(
        "post",
        "/backend/auth/users/coin/operation",
        {
            data
        }
    );
};

/** 封禁用户 */
export const banUser = (data?: object) => {
    return http.request<SuccessResult>("post", "/backend/auth/users/black", {
        data
    });
};

/** 编辑用户 */
export const editUser = (data?: object) => {
    return http.request<SuccessResult>("put", "/backend/auth/users", {
        data
    });
};

/** 获取用户充值记录 */
export const getUserRecord = (params?: object) => {
    return http.request<ResultTable>("get", "/backend/auth/users/order", {
        params
    });
};
