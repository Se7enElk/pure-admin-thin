/*
 * @Author: Elk
 * @Date: 2025-01-02 16:44:17
 * @FilePath: /lemon9-admin/src/api/user.ts
 * @Description: 用户相关接口
 */
import { http } from "@/utils/http";

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

/** 获取投放列表*/
export const getLaunchList = (params?: object) => {
    return http.request<ResultTable>("get", "/backend/auth/launch", { params });
};

export const getAddLaunchList = (data?: object) => {
    return http.request("put", "/backend/auth/launch", { data });
};
export const deleteAddLaunch = (data?: object) => {
    return http.request("post", "/backend/auth/launch/delete", { data });
};

export const getAddLaunchStatus = (params?: object) => {
    return http.request("put", "/backend/auth/launch/status", { params });
};
