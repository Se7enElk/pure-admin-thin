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
        <!-- Common User Info Header -->
        <div v-if="userInfo" class="user-info ml-5">
            <img
                v-if="userInfo.avatar"
                class="w-[80px] h-[80px] rounded-full mr-4"
                :src="userInfo.avatar"
            />
            <div
                v-if="userInfo.id"
                class="flex flex-col text-sm text-gray-500 font-bold pt-3"
            >
                <p>用户昵称：{{ userInfo.nick_name }}</p>
                <p>用户ID：{{ userInfo.id_number }}</p>
                <p>UID：{{ userInfo.id }}</p>
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
    userInfo: {
        type: Object
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
