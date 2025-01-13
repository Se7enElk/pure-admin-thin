<template>
    <div class="p-4">
        <user-chat-record-dialog
            v-model="visible"
            :user-info="userInfo"
            :character-id="characterId"
        />
        <el-button @click="visible = true">Open Dialog</el-button>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import UserChatRecordDialog from "../UserChatRecordDialog.vue";
import { getCharacterChatRecord } from "@/api/character";

const visible = ref(true);
const characterId = ref(123);
const userInfo = ref({
    id: 456,
    nick_name: "Test User",
    avatar: "https://placeholder.co/100",
    id_number: "USER123"
});

// Mock data for testing different message combinations
const mockData = {
    status: 200,
    data: {
        record_list: [
            {
                character_id: 123,
                input: "Hello, how are you?",
                input_time: Date.now() / 1000,
                input_type: "TEXT",
                input_url: "",
                record_id: 1,
                reply: "I'm doing well! Here's a picture and some audio.",
                reply_time: Date.now() / 1000 + 1,
                reply_tts_audio: "https://example.com/audio.mp3",
                reply_tts_audio_duration: 3,
                reply_type: "TEXT",
                reply_url: "https://placeholder.co/300"
            },
            {
                character_id: 123,
                input: "",
                input_time: Date.now() / 1000 + 2,
                input_type: "IMAGE",
                input_url: "https://placeholder.co/300",
                record_id: 2,
                reply: "Nice picture!",
                reply_time: Date.now() / 1000 + 3,
                reply_tts_audio: "",
                reply_tts_audio_duration: 0,
                reply_type: "TEXT",
                reply_url: ""
            },
            {
                character_id: 123,
                input: "Can you speak?",
                input_time: Date.now() / 1000 + 4,
                input_type: "TEXT",
                input_url: "",
                record_id: 3,
                reply: "",
                reply_time: Date.now() / 1000 + 5,
                reply_tts_audio: "https://example.com/audio2.mp3",
                reply_tts_audio_duration: 2,
                reply_type: "AUDIO",
                reply_url: ""
            },
            {
                character_id: 123,
                input: "Testing mixed content",
                input_time: Date.now() / 1000 + 6,
                input_type: "TEXT",
                input_url: "https://placeholder.co/300",
                record_id: 4,
                reply: "Here's my mixed response with text, image, and audio!",
                reply_time: Date.now() / 1000 + 7,
                reply_tts_audio: "https://example.com/audio3.mp3",
                reply_tts_audio_duration: 4,
                reply_type: "TEXT",
                reply_url: "https://placeholder.co/300"
            }
        ]
    }
};

// Mock the API response for testing
vi.mock("@/api/character", () => ({
    getCharacterChatRecord: vi.fn().mockResolvedValue(mockData)
}));

onMounted(() => {
    visible.value = true;
});
</script>
