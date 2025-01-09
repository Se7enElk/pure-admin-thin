<!--
 * @Author: Elk
 * @Date: 2025-01-04 16:12:22
 * @FilePath: /lemon9-admin/src/views/user/recharge/index.vue
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
            <el-form-item label="充值类型：" prop="type">
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
            <el-form-item label="订单ID：" prop="order_id">
                <el-input
                    v-model="form.order_id"
                    placeholder="请输入订单ID"
                    clearable
                    class="!w-[180px]"
                />
            </el-form-item>
            <el-form-item label="三方ID：" prop="third_id">
                <el-input
                    v-model="form.third_id"
                    placeholder="请输入三方ID"
                    clearable
                    class="!w-[180px]"
                />
            </el-form-item>
            <el-form-item label="充值时间：" prop="created_at">
                <el-date-picker
                    v-model="form.created_at"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    clearable
                    class="!w-[320px]"
                />
            </el-form-item>
            <el-form-item label="状态：" prop="status">
                <el-select
                    v-model="form.status"
                    placeholder="请选择"
                    clearable
                    class="!w-[180px]"
                >
                    <el-option label="成功" value="SUCCESS" />
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
                />
            </template>
        </PureTableBar>
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
