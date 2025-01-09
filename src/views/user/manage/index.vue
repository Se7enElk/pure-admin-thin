<!--
 * @Author: Elk
 * @Date: 2025-01-04 16:12:22
 * @FilePath: /lemon9-admin/src/views/user/manage/index.vue
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
            <el-form-item label="用户昵称" prop="nick_name">
                <el-input
                    v-model="form.nick_name"
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
            <el-form-item label="UID：" prop="id">
                <el-input
                    v-model="form.id"
                    placeholder="请输入UID"
                    clearable
                    class="!w-[180px]"
                />
            </el-form-item>
            <el-form-item label="用户类型：" prop="type">
                <el-select
                    v-model="form.type"
                    placeholder="请选择"
                    clearable
                    class="!w-[180px]"
                >
                    <el-option label="创作者" value="CREATOR" />
                    <el-option label="普通用户" value="USER" />
                </el-select>
            </el-form-item>
            <el-form-item label="用户标签：" prop="labels">
                <el-select
                    v-model="form.labels"
                    multiple
                    placeholder="请选择"
                    clearable
                    class="!w-[180px]"
                >
                    <el-option
                        v-for="item in UserLabel"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="是否会员：" prop="vip">
                <el-select
                    v-model="form.vip"
                    placeholder="请选择"
                    clearable
                    class="!w-[180px]"
                >
                    <el-option label="会员" :value="true" />
                    <el-option label="不是会员" :value="false" />
                </el-select>
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
                            @click="openDialog(row, 'freeTimes')"
                        >
                            免费次数
                        </el-button>
                        <el-button
                            class="reset-margin"
                            link
                            type="primary"
                            :size="size"
                            @click="openDialog(row, 'vip')"
                        >
                            编辑会员
                        </el-button>
                        <el-button
                            class="reset-margin"
                            link
                            type="primary"
                            :size="size"
                            @click="openDialog(row, 'coin')"
                        >
                            编辑金币
                        </el-button>
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
                            type="primary"
                            :size="size"
                            @click="openDialog(row, 'label')"
                        >
                            用户标签
                        </el-button>
                        <el-button
                            class="reset-margin"
                            link
                            type="primary"
                            :size="size"
                            @click="openDialog(row, 'type')"
                        >
                            用户类型
                        </el-button>
                        <el-button
                            class="reset-margin"
                            link
                            type="danger"
                            :size="size"
                            @click="openDialog(row, 'ban')"
                        >
                            封禁用户
                        </el-button>
                    </template>
                </pure-table>
            </template>
        </PureTableBar>

        <user-free-times-dialog
            v-model="freeTimesDialogVisible"
            :user-info="editRow"
            @success="onSearch"
        />

        <user-vip-dialog
            v-model="vipDialogVisible"
            :user-info="editRow"
            @success="onSearch"
        />

        <user-coin-dialog
            v-model="coinDialogVisible"
            :user-info="editRow"
            @success="onSearch"
        />

        <user-ban-dialog
            v-model="banDialogVisible"
            :user-info="editRow"
            @success="onSearch"
        />

        <user-labels-dialog
            v-model="labelsDialogVisible"
            :user-info="editRow"
            @success="onSearch"
        />

        <user-type-dialog
            v-model="typeDialogVisible"
            :user-info="editRow"
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
import { cloneDeep } from "@pureadmin/utils";
import { useRouter } from "vue-router";
import { storageLocal } from "@pureadmin/utils";
import UserFreeTimesDialog from "@/components/Dialog/User/UserFreeTimesDialog.vue";
import UserVipDialog from "@/components/Dialog/User/UserVipDialog.vue";
import UserCoinDialog from "@/components/Dialog/User/UserCoinDialog.vue";
import UserBanDialog from "@/components/Dialog/User/UserBanDialog.vue";
import UserLabelsDialog from "@/components/Dialog/User/UserLabelsDialog.vue";
import UserTypeDialog from "@/components/Dialog/User/UserTypeDialog.vue";

const router = useRouter();
const { getEnumOptions } = useUserStoreHook();
const UserLabel = getEnumOptions("UserLabel");
const editRow = ref(null);

// Dialog visibility states
const freeTimesDialogVisible = ref(false);
const vipDialogVisible = ref(false);
const coinDialogVisible = ref(false);
const banDialogVisible = ref(false);
const labelsDialogVisible = ref(false);
const typeDialogVisible = ref(false);

const openDialog = (row: any, type?: string) => {
    editRow.value = cloneDeep(row);
    if (type === "freeTimes") {
        freeTimesDialogVisible.value = true;
    } else if (type === "vip") {
        vipDialogVisible.value = true;
    } else if (type === "coin") {
        coinDialogVisible.value = true;
    } else if (type === "ban") {
        banDialogVisible.value = true;
    } else if (type === "label") {
        labelsDialogVisible.value = true;
    } else if (type === "type") {
        typeDialogVisible.value = true;
    }
};

const handleClose = () => {
    freeTimesDialogVisible.value = false;
    vipDialogVisible.value = false;
    coinDialogVisible.value = false;
    banDialogVisible.value = false;
    labelsDialogVisible.value = false;
    typeDialogVisible.value = false;
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
