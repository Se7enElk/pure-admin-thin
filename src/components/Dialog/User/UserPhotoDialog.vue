<!--
 * @Author: Elk
 * @Date: 2025-01-09 18:32:00
 * @FilePath: /lemon9-admin/src/components/Dialog/User/UserPhotoDialog.vue
 * @Description: 
-->
<template>
    <base-user-dialog
        v-model="visible"
        title="角色相册"
        :user-info="userInfo"
        @close="handleClose"
        @save="handleClose"
    >
        <div class="grid grid-cols-3 gap-4">
            <div v-for="item in photoData" :key="item.id" class="photo-item">
                <el-image
                    :src="item.image_url"
                    :preview-src-list="[item.image_url]"
                    fit="cover"
                    class="w-full h-[300px] rounded-lg"
                    preview-teleported
                />
                <div class="mt-2 text-center">
                    <p class="text-gray-700">昵称：{{ item.nick_name }}</p>
                    <p class="text-gray-500 text-sm">
                        用户ID：{{ item.id_number }}
                    </p>
                    <p class="text-gray-500 text-sm">UID：{{ item.uid }}</p>
                </div>
            </div>
        </div>
    </base-user-dialog>
</template>

<script setup lang="ts">
import { computed } from "vue";
import BaseUserDialog from "./BaseUserDialog.vue";

interface PhotoItem {
    character_id: string;
    id_number: string;
    image_url: string;
    nick_name: string;
    uid: string;
    vague_image_url: string;
}

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    },
    userInfo: {
        type: Object
    },
    photoData: {
        type: Array as PropType<PhotoItem[]>,
        required: true,
        default: () => []
    }
});

const emit = defineEmits(["update:modelValue"]);

const visible = computed({
    get: () => props.modelValue,
    set: value => emit("update:modelValue", value)
});

const handleClose = () => {
    emit("update:modelValue", false);
};
</script>

<style scoped lang="scss">
.photo-item {
    @apply bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow;
}
</style>
