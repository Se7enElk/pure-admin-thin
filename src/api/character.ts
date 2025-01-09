/*
 * @Author: Elk
 * @Date: 2025-01-02 16:44:17
 * @FilePath: /lemon9-admin/src/api/character.ts
 * @Description: 角色相关接口
 */
import { http } from "@/utils/http";

type AnyResult = {
    success: boolean;
    data: any;
    status: number;
    message: string;
};

// type SuccessResult = {
//     success: boolean;
//     status: number;
//     message: string;
// };

type CharacterListResult = {
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

/** 角色列表 */
export const getCharacterList = (params?: object) => {
    return http.request<CharacterListResult>("get", "/backend/auth/character", {
        params
    });
};

/** 用户聊过天的角色列表 */
export const getUserChatCharacterList = (params?: object) => {
    return http.request<CharacterListResult>(
        "get",
        "/backend/auth/character/chat/info",
        {
            params
        }
    );
};

/** 角色聊天记录 */
export const getCharacterChatRecord = (params?: object) => {
    return http.request<CharacterListResult>(
        "get",
        "/backend/auth/character/chat/detail",
        {
            params
        }
    );
};

/** 角色相册 */
export const getCharacterPhoto = (params?: object) => {
    return http.request<AnyResult>("get", "/backend/auth/character/album", {
        params
    });
};
