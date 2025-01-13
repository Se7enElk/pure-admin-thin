export interface UserInfo {
    id: number;
    uid?: number;
    nick_name?: string;
    avatar?: string;
    id_number?: string;
    username?: string;
    description?: string;
    email?: string;
    roles?: string[];
    permissions?: string[];
    phone?: string;
    privilege_info?: {
        privileges?: Record<string, number>;
        vip_privileges?: Record<string, number>;
        vip?: {
            vip: boolean;
            vip_expire_time?: string;
        };
        common_refresh_time?: string;
        month?: string;
    };
    statistics?: {
        character_count: number;
        character: number;
        message_count: number;
        image_count: number;
        tts_count: number;
    };
    labels?: string[];
    coin?: number;
    type?: string;
}
