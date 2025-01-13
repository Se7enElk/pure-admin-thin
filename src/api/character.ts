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

type MessageType = "TEXT" | "IMAGE" | "AUDIO";

interface ChatRecord {
    character_id: number;
    input: string;
    input_time: number;
    input_type: MessageType;
    input_url: string;
    record_id: number;
    reply: string;
    reply_time: number;
    reply_tts_audio: string;
    reply_tts_audio_duration: number;
    reply_type: MessageType;
    reply_url: string;
}

type CharacterListResult = {
    success: boolean;
    status: number;
    data?: {
        /** 列表数据 */
        content?: Array<any>;
        /** 聊天记录数据 */
        record_list?: ChatRecord[];
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

/* 删除角色 */
export const deleteCharacter = (data?: object) => {
    return http.request<AnyResult>("delete", "/backend/auth/character", {
        data
    });
};

/* 恢复角色 */
export const recoverCharacter = (data?: object) => {
    return http.request<AnyResult>("put", "/backend/auth/character/restore", {
        data
    });
};

/* 编辑角色 */
export const editCharacter = (data?: object) => {
    return http.request<AnyResult>("put", "/backend/auth/character/edit", {
        data
    });
};

/* 角色详情 */
export const getCharacterDetail = (params?: object) => {
    return http.request<AnyResult>("get", "/backend/auth/character/detail", {
        params
    });
};

/* 角色排序 */
export const sortCharacter = (data?: object) => {
    return http.request<AnyResult>("put", "/backend/auth/character/position", {
        data
    });
};
