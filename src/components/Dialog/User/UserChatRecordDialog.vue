<!--
 * @Author: Elk
 * @Date: 2025-01-09 18:32:00
 * @FilePath: /lemon9-admin/src/components/Dialog/User/UserChatRecordDialog.vue
 * @Description: Chat record dialog component
-->
<template>
    <base-user-dialog
        v-model="visible"
        title="聊天记录"
        :user-info="userInfo"
        @close="handleClose"
    >
        <div class="chat-container">
            <div v-for="item in chatRecordData" :key="item.record_id" class="chat-record-item">
                <div v-if="item.input" class="user-message">
                    <component :is="renderMessageBubble(item)" />
                    <div class="timestamp text-xs text-gray-400">{{ formatTime(item.input_time) }}</div>
                </div>
                <div v-if="item.reply" class="character-message">
                    <component :is="renderReplyBubble(item)" />
                    <div class="timestamp text-xs text-gray-400">{{ formatTime(item.reply_time) }}</div>
                </div>
            </div>
        </div>
    </base-user-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, h } from "vue";
import BaseUserDialog from "./BaseUserDialog.vue";
import { getCharacterChatRecord } from "@/api/character";
import { formatTime } from "@/utils/format/time";

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

interface UserInfo {
    id: number;
    uid?: number;
    nick_name?: string;
    avatar?: string;
    id_number?: string;
}

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    },
    userInfo: {
        type: Object as () => UserInfo,
        required: true
    },
    characterId: {
        type: String,
        required: true
    }
});

const emit = defineEmits(["update:modelValue"]);

const visible = computed({
    get: () => props.modelValue,
    set: value => emit("update:modelValue", value)
});

const chatRecordData = ref<ChatRecord[]>([]);

const renderMessageBubble = (item: ChatRecord) => {
    switch (item.input_type) {
        case "TEXT":
            return h("div", { class: "bubble user" }, item.input);
        case "IMAGE":
            return h("img", {
                class: "bubble-image user",
                src: item.input_url,
                alt: "User Image"
            });
        case "AUDIO":
            return h("div", { class: "bubble-audio user" }, [
                h("audio", {
                    src: item.input_url,
                    controls: true,
                    class: "audio-player"
                }),
                h("span", { class: "play-icon" }, "▶")
            ]);
        default:
            return h("div", { class: "bubble user" }, item.input);
    }
};

const renderReplyBubble = (item: ChatRecord) => {
    switch (item.reply_type) {
        case "TEXT":
            return h("div", { class: "bubble character" }, item.reply);
        case "IMAGE":
            return h("img", {
                class: "bubble-image character",
                src: item.reply_url,
                alt: "Character Image"
            });
        case "AUDIO":
            return h("div", { class: "bubble-audio character" }, [
                h("audio", {
                    src: item.reply_tts_audio || item.reply_url,
                    controls: true,
                    class: "audio-player"
                }),
                h("span", { class: "play-icon" }, "▶")
            ]);
        default:
            return h("div", { class: "bubble character" }, item.reply);
    }
};

const getChatRecord = async () => {
    const params = {
        uid: props.userInfo.id || props.userInfo.uid,
        character_id: props.characterId
    };

    const res = await getCharacterChatRecord(params);
    if (res.status === 200) {
        chatRecordData.value = res.data.record_list;
    }
};

watch(
    () => visible.value,
    newVal => {
        if (newVal) {
            getChatRecord();
        }
    }
);

const handleClose = () => {
    emit("update:modelValue", false);
    chatRecordData.value = [];
};
</script>

<style scoped lang="scss">
.chat-container {
    max-height: 60vh;
    overflow-y: auto;
    padding: 1rem;
}

.chat-record-item {
    margin: 1.5rem 0;
}

.user-message, .character-message {
    margin: 0.75rem 0;
    position: relative;
}

.bubble {
    padding: 0.75rem 1rem;
    border-radius: 0.75rem;
    max-width: 70%;
    word-break: break-word;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.bubble-image {
    max-width: 70%;
    border-radius: 0.75rem;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.bubble-audio {
    max-width: 70%;
    border-radius: 0.5rem;
    background-color: white;
    padding: 0.5rem;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .audio-player {
        flex: 1;
        height: 32px;

        &::-webkit-media-controls-panel {
            background-color: transparent;
        }
        
        &::-webkit-media-controls-play-button {
            display: none;
        }
    }

    .play-icon {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #1890ff;
        color: white;
        border-radius: 50%;
        cursor: pointer;
        font-size: 12px;
    }
}

.user {
    margin-left: auto;
    background-color: #e6f7ff;
    border: 1px solid #91d5ff;
}

.character {
    margin-right: auto;
    background-color: #ffffff;
    border: 1px solid #e8e8e8;
}

.timestamp {
    margin-top: 0.25rem;
    text-align: right;
}

.user-message .timestamp {
    padding-right: 0.5rem;
}

.character-message .timestamp {
    text-align: left;
    padding-left: 0.5rem;
}
</style>
