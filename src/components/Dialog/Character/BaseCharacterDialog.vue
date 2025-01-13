<!--
 * @Author: Elk
 * @Date: 2025-01-09 18:48:07
 * @FilePath: /lemon9-admin/src/components/Dialog/Character/BaseCharacterDialog.vue
 * @Description: 
-->
<template>
    <el-dialog
        v-model="dialogVisible"
        :title="title"
        width="50%"
        :before-close="handleClose"
    >
        <!-- Common User Info Header -->
        <div v-if="characterInfo && showInfo" class="user-info ml-5">
            <img
                v-if="characterInfo.avatars && characterInfo.avatars.length > 0"
                class="w-[80px] h-[80px] rounded-full mr-4"
                :src="characterInfo.avatars[0]"
            />
            <div
                v-if="characterInfo.id || characterInfo.character_id"
                class="flex flex-col text-sm text-gray-500 font-bold pt-2"
            >
                <p class="mb-1">角色名称：{{ characterInfo.character_name }}</p>
                <p class="mb-1">
                    角色ID：{{ characterInfo.id || characterInfo.character_id }}
                </p>
                <p>角色性别：{{ characterInfo.character_gender }}</p>
            </div>
        </div>

        <!-- Slot for dialog-specific content -->
        <slot />

        <!-- Common Footer -->
        <template #footer>
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="handleSave"> 保存 </el-button>
        </template>
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
    characterInfo: {
        type: Object
    },
    showInfo: {
        type: Boolean,
        default: true
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

<style scoped lang="scss">
.user-info {
    display: flex;
}
</style>
