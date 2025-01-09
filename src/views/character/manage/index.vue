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

        <PureTableBar title="用户管理" :columns="columns" @refresh="onSearch">
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
                            @click="toUserDetails(row)"
                        >
                            用户详情
                        </el-button>
                        <el-button
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

        <el-dialog
            v-model="freeTimesDialogVisible"
            title="编辑免费次数"
            width="50%"
            :before-close="handleClose"
        >
            <div v-if="editRow" class="user-info ml-5">
                <img
                    v-if="editRow.avatar"
                    class="w-[80px] h-[80px] rounded-full mr-4"
                    :src="editRow.avatar"
                />
                <div class="flex flex-col text-sm text-gray-500 font-bold pt-3">
                    <p>用户昵称：{{ editRow.nick_name }}</p>
                    <p>用户ID：{{ editRow.id_number }}</p>
                    <p>UID：{{ editRow.id }}</p>
                </div>
            </div>
            <p class="ml-5 mt-5">
                下次免费次数重置时间：{{
                    dayjs(editRow?.privilege_info?.common_refresh_time).format(
                        "YYYY-MM-DD HH:mm:ss"
                    )
                }}
            </p>
            <p class="ml-5 mt-2">
                剩余消息数：{{ editRow?.privilege_info?.privileges.MESSAGE }}
            </p>
            <p class="ml-5 mt-2">
                剩余图片数：{{ editRow?.privilege_info?.privileges.PHOTO }}
            </p>
            <p class="ml-5 mt-2 mb-5">
                剩余语音数：{{ editRow?.privilege_info?.privileges.VOICE }}
            </p>
            <p class="ml-5 mt-2 mb-5">
                剩余润色次数：{{ editRow?.privilege_info?.privileges?.POLISH }}
            </p>
            <p class="ml-5 mt-2 mb-5">
                剩余生图次数：{{ editRow?.privilege_info?.privileges?.PHOTO }}
            </p>

            <!-- :rules="freeTimesRules" -->
            <el-form ref="freeTimesFormRef" :model="freeTimesForm">
                <el-form-item label="赠送消息数" prop="privileges.MESSAGE">
                    <el-input-number
                        v-model="freeTimesForm.privileges.MESSAGE"
                        class="!w-[200px]"
                    />
                </el-form-item>
                <el-form-item label="赠送图片数" prop="privileges.PHOTO">
                    <el-input-number
                        v-model="freeTimesForm.privileges.PHOTO"
                        class="!w-[200px]"
                    />
                </el-form-item>
                <el-form-item label="赠送语音数" prop="privileges.VOICE">
                    <el-input-number
                        v-model="freeTimesForm.privileges.VOICE"
                        class="!w-[200px]"
                    />
                </el-form-item>
                <el-form-item label="赠送润色次数" prop="privileges.POLISH">
                    <el-input-number
                        v-model="freeTimesForm.privileges.POLISH"
                        class="!w-[200px]"
                    />
                </el-form-item>
                <el-form-item
                    label="赠送解锁图片次数"
                    prop="privileges.UNLOCK_ALBUM"
                >
                    <el-input-number
                        v-model="freeTimesForm.privileges.UNLOCK_ALBUM"
                        class="!w-[200px]"
                    />
                </el-form-item>
            </el-form>

            <template #footer>
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="handleFreeTimesSave">
                    保存
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { message } from "@/utils/message";
import { ref, nextTick } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useUserStoreHook } from "@/store/modules/user";
import Refresh from "@iconify-icons/ep/refresh";
import { PureTableBar } from "@/components/RePureTableBar";
import { useUserManage } from "./hooks";
import dayjs from "dayjs";
import {
    addFreeTimes,
    addVip,
    coinOperation,
    banUser,
    editUser
} from "@/api/user";
import { cloneDeep } from "@pureadmin/utils";
import { useRouter } from "vue-router";
import { storageLocal } from "@pureadmin/utils";

const router = useRouter();
const { getEnumOptions } = useUserStoreHook();
const UserLabel = getEnumOptions("UserLabel");
const editRow = ref(null);
const openDialog = (row: any, type?: string) => {
    editRow.value = row;
    if (type === "freeTimes") {
        editRow.value = cloneDeep(row);
        freeTimesForm.value = {
            uid: row.id,
            privileges: {
                POLISH: 0,
                UNLOCK_ALBUM: 0,
                VOICE: 0,
                PHOTO: 0,
                MESSAGE: 0
            },
            month: row.privilege_info.month
        };
        freeTimesDialogVisible.value = true;
    }
};

const handleClose = () => {
    freeTimesDialogVisible.value = false;
};

const freeTimesForm = ref({
    month: "",
    privileges: {
        POLISH: 0,
        UNLOCK_ALBUM: 0,
        VOICE: 0,
        PHOTO: 0,
        MESSAGE: 0
    },
    uid: ""
});

const freeTimesRules = {
    "privileges.MESSAGE": [
        { required: true, message: "请输入赠送消息数", trigger: "blur" }
    ],
    "privileges.PHOTO": [
        { required: true, message: "请输入赠送图片数", trigger: "blur" }
    ],
    "privileges.VOICE": [
        { required: true, message: "请输入赠送语音数", trigger: "blur" }
    ]
};

const freeTimesDialogVisible = ref(false);
const freeTimesFormRef = ref(null);
const handleFreeTimesSave = async () => {
    try {
        // 表单校验
        const valid = await freeTimesFormRef.value.validate();
        if (!valid) return;
        const res = await addFreeTimes(freeTimesForm.value);
        if (res.status === 200) {
            message("添加特权次数成功", {
                type: "success"
            });
            freeTimesDialogVisible.value = false;
            onSearch();
            nextTick(() => {
                editRow.value = null;
                freeTimesForm.value = {
                    uid: "",
                    privileges: {
                        POLISH: 0,
                        UNLOCK_ALBUM: 0,
                        VOICE: 0,
                        PHOTO: 0,
                        MESSAGE: 0
                    },
                    month: ""
                };
            });
        }
    } catch (error) {
        console.log(error);
    }
};
const toUserDetails = (row: any) => {
    storageLocal().setItem("userInfo", row);
    router.push({
        path: "/user/detail",
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
    handleCurrentChange
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
