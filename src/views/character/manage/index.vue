<!--
 * @Author: Elk
 * @Date: 2025-01-04 16:12:22
 * @FilePath: /lemon9-admin/src/views/character/manage/index.vue
 * @Description: 用户管理
-->
<template>
    <div>
        <el-form
            ref="formRef"
            :inline="true"
            :model="form"
            class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
        >
            <el-form-item label="用户昵称" prop="creator_name">
                <el-input
                    v-model="form.creator_name"
                    placeholder="请输入用户昵称"
                    clearable
                    class="!w-[180px]"
                />
            </el-form-item>
            <el-form-item label="用户ID：" prop="id_number">
                <el-input
                    v-model="form.id_number"
                    placeholder="请输入用户ID"
                    clearable
                    class="!w-[180px]"
                />
            </el-form-item>
            <el-form-item label="UID：" prop="uid">
                <el-input
                    v-model="form.uid"
                    placeholder="请输入UID"
                    clearable
                    class="!w-[180px]"
                />
            </el-form-item>
            <el-form-item label="角色名称" prop="character_name">
                <el-input
                    v-model="form.character_name"
                    placeholder="请输入角色名称"
                    clearable
                    class="!w-[180px]"
                />
            </el-form-item>
            <el-form-item label="角色ID" prop="character_id">
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

        <PureTableBar title="角色管理" :columns="columns" @refresh="onSearch">
            <template v-slot="{ size, dynamicColumns }">
                <pure-table
                    ref="tableRef"
                    row-key="id"
                    align-whole="center"
                    table-layout="auto"
                    :loading="loading"
                    :size="size"
                    adaptive
                    :adaptiveConfig="{ offsetBottom: 108 }"
                    :data="dataList"
                    :columns="dynamicColumns"
                    :pagination="{ ...pagination, size }"
                    :header-cell-style="{
                        background: 'var(--el-fill-color-light)',
                        color: 'var(--el-text-color-primary)'
                    }"
                    @page-size-change="handleSizeChange"
                    @page-current-change="handleCurrentChange"
                >
                    <template #operation="{ row }">
                        <el-button
                            class="reset-margin"
                            link
                            type="primary"
                            :size="size"
                            @click="toCharacterDetails(row)"
                        >
                            角色详情
                        </el-button>
                        <el-button
                            v-if="row.status === 'DELETED'"
                            class="reset-margin"
                            link
                            type="success"
                            :size="size"
                            @click="openDialog(row, 'recover')"
                        >
                            恢复
                        </el-button>
                        <el-button
                            v-else
                            class="reset-margin"
                            link
                            type="danger"
                            :size="size"
                            @click="openDialog(row, 'delete')"
                        >
                            删除
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
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useUserStoreHook } from "@/store/modules/user";
import Refresh from "@iconify-icons/ep/refresh";
import { PureTableBar } from "@/components/RePureTableBar";
import { useUserManage } from "./hooks";
import { useRouter } from "vue-router";
import UserPhotoDialog from "@/components/Dialog/User/UserPhotoDialog.vue";
import CharacterDeleteDialog from "@/components/Dialog/Character/CharacterDeleteDialog.vue";
import CharacterRecoverDialog from "@/components/Dialog/Character/CharacterRecoverDialog.vue";

const router = useRouter();
const editRow = ref(null);

const deleteDialog = ref(false);
const recoverDialog = ref(false);
const openDialog = (row: any, type?: string) => {
    console.log(row);
    editRow.value = row;
    if (type === "delete") {
        deleteDialog.value = true;
    } else if (type === "recover") {
        recoverDialog.value = true;
    }
};
const toCharacterDetails = (row: any) => {
    router.push({
        path: "/character/detail",
        query: { id: row.id }
    });
};

const {
    form,
    formRef,
    dataList,
    loading,
    onSearch,
    resetForm,
    columns,
    pagination,
    handleSizeChange,
    handleCurrentChange,
    photoDialog,
    photoData,
    showPhotoDialog
} = useUserManage();
</script>

<style scoped lang="scss">
.user-info {
    display: flex;
}

:deep(.el-radio) {
    width: 100%;
    text-align: left;
}
</style>
