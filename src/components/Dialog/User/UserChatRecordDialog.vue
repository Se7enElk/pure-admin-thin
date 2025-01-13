<!--
 * @Author: Elk
 * @Date: 2025-01-09 18:32:00
 * @FilePath: /lemon9-admin/src/components/Dialog/User/UserChatRecordDialog.vue
 * @Description: 
-->
<template>
    <base-user-dialog
        v-model="visible"
        title="聊天记录"
        :user-info="userInfo"
        @close="handleClose"
        @save="handleClose"
    >
        <div v-for="item in chatRecordData" :key="item.id">
            <p>{{ item.content }}</p>
        </div>
    </base-user-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import BaseUserDialog from "./BaseUserDialog.vue";
import { getCharacterChatRecord } from "@/api/character";

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    },
    userInfo: {
        type: Object,
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

const chatRecordData = ref([]);

const getChatRecord = async () => {
    const params = {
        uid: props.userInfo.id || props.userInfo.uid,
        character_id: props.characterId
    };

    const res = await getCharacterChatRecord(params);
    if (res.status === 200) {
        chatRecordData.value = res.data.content;
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
