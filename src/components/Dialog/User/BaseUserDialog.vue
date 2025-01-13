<!--
 * @Author: Elk
 * @Date: 2025-01-09 18:48:07
 * @FilePath: /lemon9-admin/src/components/Dialog/User/BaseUserDialog.vue
 * @Description: 
-->
<template>
    <el-dialog
        v-model="dialogVisible"
        :title="title"
        width="788px"
        :before-close="handleClose"
        class="chat-record-dialog"
    >
        <!-- Dialog Header Info -->
        <div
            class="flex justify-between items-start px-6 py-5 border-b border-gray-100 bg-white"
        >
            <div class="flex flex-col">
                <div class="text-[15px] font-medium text-gray-900">
                    角色名称
                </div>
                <div class="text-sm text-gray-500 mt-1.5">
                    角色ID: {{ characterId }}
                </div>
            </div>
            <div class="flex flex-col items-end">
                <div class="text-[15px] font-medium text-gray-900">
                    {{ userInfo?.nick_name || "用户" }}
                </div>
                <div class="text-sm text-gray-500 mt-1.5">
                    UID: {{ userInfo?.id || userInfo?.uid }}
                </div>
            </div>
        </div>

        <!-- Slot for dialog-specific content -->
        <slot />
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    userInfo: {
        type: Object
    },
    characterId: {
        type: [String, Number],
        default: ""
    }
});

const emit = defineEmits(["update:modelValue", "close", "save"]);

const dialogVisible = computed({
    get: () => props.modelValue,
    set: value => emit("update:modelValue", value)
});

const handleClose = () => {
    emit("close");
};

const handleSave = () => {
    emit("save");
};
</script>

<style>
/* All styles converted to Tailwind utility classes */
</style>
