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
        class="overflow-hidden"
        @close="handleClose"
    >
        <div class="h-[60vh] px-6 py-4 overflow-y-auto bg-gray-50">
            <div
                v-for="item in chatRecordData"
                :key="item.record_id"
                class="my-8 first:mt-4 last:mb-4"
            >
                <div v-if="hasUserContent(item)" class="relative my-4">
                    <div class="flex flex-row-reverse items-start gap-3">
                        <div
                            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f0f9ff] text-sm text-gray-600 border border-[#e5f3ff]"
                        >
                            用户
                        </div>
                        <div class="flex max-w-[70%] flex-col gap-2">
                            <!-- User Text Content -->
                            <div v-if="item.input" class="user-bubble">
                                {{ item.input }}
                            </div>

                            <!-- User Image Content -->
                            <img
                                v-if="item.input_url"
                                :src="item.input_url"
                                :alt="'User Image'"
                                class="max-w-[300px] rounded-xl ml-auto"
                            />
                        </div>
                    </div>
                    <div class="mt-2 pr-14 text-right text-xs text-gray-400">
                        {{ formatTime(item.input_time) }}
                    </div>
                </div>
                <div v-if="hasCharacterContent(item)" class="relative my-4">
                    <div class="flex items-start gap-3">
                        <div
                            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm text-gray-600 border border-gray-200"
                        >
                            角色
                        </div>
                        <div class="flex max-w-[70%] flex-col gap-2">
                            <!-- Character Text Content -->
                            <div v-if="item.reply" class="character-bubble">
                                {{ item.reply }}
                            </div>

                            <!-- Character Image Content -->
                            <img
                                v-if="item.reply_url"
                                :src="item.reply_url"
                                :alt="'Character Image'"
                                class="max-w-[300px] rounded-xl mr-auto"
                            />

                            <!-- Character Audio Content -->
                            <div
                                v-if="item.reply_tts_audio"
                                class="flex max-w-[70%] items-center gap-2 rounded-xl bg-white p-3 shadow-sm mr-auto"
                            >
                                <audio
                                    :id="`audio-${item.record_id}`"
                                    :src="item.reply_tts_audio"
                                    class="hidden"
                                />
                                <button
                                    class="audio-button"
                                    @click="toggleAudio(item.record_id)"
                                >
                                    播放语音
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="mt-2 pl-14 text-xs text-gray-400">
                        {{ formatTime(item.reply_time) }}
                    </div>
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

const hasUserContent = (item: ChatRecord): boolean => {
    return Boolean(item.input || item.input_url);
};

const hasCharacterContent = (item: ChatRecord): boolean => {
    return Boolean(item.reply || item.reply_url || item.reply_tts_audio);
};

const toggleAudio = (recordId: number) => {
    const audio = document.querySelector(
        `#audio-${recordId}`
    ) as HTMLAudioElement;
    if (audio) {
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
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

<style>
/* Common message bubble styles */
.message-bubble {
    @apply w-full break-words rounded-xl p-3 shadow-sm;
}

.user-bubble {
    @apply message-bubble bg-[#f0f9ff] border border-[#e5f3ff];
}

.character-bubble {
    @apply message-bubble bg-white border border-gray-200;
}

.audio-button {
    @apply flex items-center justify-center rounded-xl px-5 py-2.5 text-sm text-white bg-[#4096ff] hover:bg-[#4096ff]/90 transition-colors cursor-pointer shadow-sm;
}

/* Element Plus overrides */
:deep(.el-dialog__body) {
    padding: 0;
}
</style>
