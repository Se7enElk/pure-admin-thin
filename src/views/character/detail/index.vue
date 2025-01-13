<!--
 * @Author: Elk
 * @Date: 2025-01-09 17:44:11
 * @FilePath: /lemon9-admin/src/views/character/detail/index.vue
 * @Description: 
-->
<template>
    <div>
        <el-form
            ref="formRef"
            :inline="true"
            :model="form"
            class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
        >
            <el-form-item label="角色ID：" prop="id">
                <el-input
                    v-model="form.character_id"
                    placeholder="请输入角色ID"
                    clearable
                    class="!w-[180px]"
                />
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    :icon="useRenderIcon('ri:search-line')"
                    :loading="loading"
                    @click="onSearch"
                >
                    搜索
                </el-button>
                <el-button
                    :icon="useRenderIcon(Refresh)"
                    @click="resetForm(formRef)"
                >
                    重置
                </el-button>
            </el-form-item>
        </el-form>

        <el-card
            v-if="userInfo && userInfo.uid"
            header="创建人信息"
            shadow="never"
            class="mt-2"
        >
            <!-- 用户头像 -->
            <div class="flex items-center mb-8">
                <img
                    v-if="userInfo.avatar"
                    :src="userInfo.avatar"
                    alt="用户头像"
                    class="w-32 h-32 rounded-full"
                />
                <div class="ml-4">
                    <p class="text-lg font-bold mb-3">
                        用户名称：{{ userInfo.nick_name }}
                    </p>
                    <p class="text-sm text-gray-500 mb-3">
                        Lemon9 ID:{{ userInfo.id_number }}
                    </p>
                    <p class="text-sm text-gray-500">UID:{{ userInfo.uid }}</p>
                </div>
            </div>
        </el-card>

        <el-card
            v-if="characterInfo && characterInfo.character_id"
            shadow="never"
            class="mt-2"
        >
            <el-button type="primary" @click="openDialog('photo')"
                >角色相册</el-button
            >
            <el-button type="warning" @click="openDialog('edit')"
                >编辑角色</el-button
            >
            <el-button type="danger" @click="openDialog('delete')"
                >删除角色</el-button
            >
            <el-button type="success" @click="openDialog('restore')"
                >恢复角色</el-button
            >
            <el-button type="warning" @click="openDialog('sort')"
                >排序角色</el-button
            >
        </el-card>

        <el-card
            v-if="characterInfo && characterInfo.character_id"
            header="角色信息"
            shadow="never"
            class="mt-2"
        >
            <!-- 角色头像 -->
            <div class="flex items-center mb-8">
                <img
                    v-if="
                        characterInfo.avatars &&
                        characterInfo.avatars.length > 0
                    "
                    :src="characterInfo.avatars[0]"
                    alt="角色头像"
                    class="w-32 h-32 rounded-full"
                />
                <div class="ml-4">
                    <p class="text-lg font-bold mb-3">
                        角色名称：{{ characterInfo.character_name }}
                    </p>
                    <p class="text-sm text-gray-500 mb-3">
                        角色ID:{{ characterInfo.character_id }}
                    </p>
                    <p class="text-sm text-gray-500">
                        角色性别:{{ characterInfo.character_gender }}
                    </p>
                </div>
            </div>

            <el-form label-width="120px" class="text-sm">
                <!-- 动态生成表单项 -->
                <el-form-item label="角色可见人: " class="pb-1">
                    <span class="text-gray-700"> 角色可见人 </span>
                </el-form-item>
                <el-form-item label="是否NSFW: " class="pb-1">
                    <span class="text-gray-700">{{
                        characterInfo.rating
                    }}</span>
                </el-form-item>
                <el-form-item label="角色简介: " class="pb-1">
                    <span class="text-gray-700">{{
                        characterInfo.introduction
                    }}</span>
                </el-form-item>
                <el-form-item label="角色问候语: " class="pb-1">
                    <span class="text-gray-700">{{
                        characterInfo.greeting
                    }}</span>
                </el-form-item>
                <el-form-item label="角色详情: " class="pb-1">
                    <span class="text-gray-700">{{
                        characterInfo.setting
                    }}</span>
                </el-form-item>
                <el-form-item label="与角色的背景: " class="pb-1">
                    <span class="text-gray-700">{{
                        characterInfo.scenario
                    }}</span>
                </el-form-item>
            </el-form>
        </el-card>

        <PureTableBar
            v-if="characterInfo && characterInfo.character_id"
            :columns="chatColumns"
            @refresh="getCharacterData"
        >
            <template v-slot="{ size, dynamicColumns }">
                <pure-table
                    row-key="id"
                    align-whole="center"
                    table-layout="auto"
                    :loading="chatLoading"
                    :size="size"
                    :data="chatData"
                    :columns="dynamicColumns"
                    :pagination="{ ...chatPagination, size }"
                    :header-cell-style="{
                        background: 'var(--el-fill-color-light)',
                        color: 'var(--el-text-color-primary)'
                    }"
                    @page-size-change="handleChatSizeChange"
                    @page-current-change="handleChatCurrentChange"
                >
                    <template #operation="{ row }">
                        <el-button
                            class="reset-margin"
                            link
                            type="primary"
                            :size="size"
                            @click="openDialog('chatRecord', row)"
                        >
                            聊天记录
                        </el-button>
                    </template>
                </pure-table>
            </template>
        </PureTableBar>

        <user-photo-dialog v-model="photoDialog" :photo-data="photoData" />

        <character-delete-dialog
            v-model="deleteDialog"
            :character-info="editRow"
            @success="onSearch"
        />

        <character-recover-dialog
            v-model="recoverDialog"
            :character-info="editRow"
            @success="onSearch"
        />

        <character-edit-dialog
            v-model="editDialog"
            :character-info="editRow"
            @success="onSearch"
        />

        <character-sort-dialog
            v-model="sortDialog"
            :character-info="editRow"
            @success="onSearch"
        />

        <user-chat-record-dialog
            v-model="chatDialog"
            :user-info="transformedUserInfo"
            :character-id="characterInfo.character_id"
        />
    </div>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useCharacterDetail } from "./hooks";
import Refresh from "@iconify-icons/ep/refresh";
import { useRoute } from "vue-router";
import { cloneDeep } from "@pureadmin/utils";
import { PureTableBar } from "@/components/RePureTableBar";
import UserPhotoDialog from "@/components/Dialog/User/UserPhotoDialog.vue";
import CharacterDeleteDialog from "@/components/Dialog/Character/CharacterDeleteDialog.vue";
import CharacterRecoverDialog from "@/components/Dialog/Character/CharacterRecoverDialog.vue";
import CharacterEditDialog from "@/components/Dialog/Character/CharacterEditDialog.vue";
import CharacterSortDialog from "@/components/Dialog/Character/CharacterSortDialog.vue";
import UserChatRecordDialog from "@/components/Dialog/User/UserChatRecordDialog.vue";
const route = useRoute();

const {
    form,
    formRef,
    loading,
    onSearch,
    resetForm,
    characterInfo,
    userInfo,
    chatColumns,
    getCharacterData,
    chatLoading,
    chatData,
    chatPagination,
    handleChatSizeChange,
    handleChatCurrentChange,

    photoDialog,
    photoData,
    showPhotoDialog
} = useCharacterDetail();

// 设置form的id 从query中获取
form.value.character_id = route.query.id as string;

const editRow = ref({});

const editDialog = ref(false);
const deleteDialog = ref(false);
const recoverDialog = ref(false);
const sortDialog = ref(false);
const chatDialog = ref(false);

const transformedUserInfo = computed(() => ({
    ...userInfo.value,
    id: Number(userInfo.value.uid),
    uid: Number(userInfo.value.uid),
    nick_name: userInfo.value.nick_name || "",
    avatar: userInfo.value.avatar || "",
    id_number: userInfo.value.id_number || ""
}));
const openDialog = (type?: string, row?: any) => {
    editRow.value = cloneDeep(characterInfo.value);
    switch (type) {
        case "edit":
            editDialog.value = true;
            break;
        case "photo":
            showPhotoDialog(characterInfo.value.character_id);
            break;
        case "delete":
            deleteDialog.value = true;
            break;
        case "restore":
            recoverDialog.value = true;
            break;
        case "sort":
            sortDialog.value = true;
            break;
        case "chatRecord":
            console.log("chatRecord");
            chatDialog.value = true;
            // chatRecordForm.value.uid = userInfo.value.id;
            // chatRecordForm.value.character_id = row.id;
            break;
    }
};
</script>
<style scoped lang="scss">
.user-info {
    display: flex;
}

.photo-item {
    @apply bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow;
}
</style>
