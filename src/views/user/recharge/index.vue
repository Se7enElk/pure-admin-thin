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
            <el-form-item label="UID：" prop="uid">
                <el-input
                    v-model="form.uid"
                    placeholder="请输入UID"
                    clearable
                    class="!w-[180px]"
                />
            </el-form-item>
            <el-form-item label="订单ID：" prop="order_id">
                <el-input
                    v-model="form.order_id"
                    placeholder="请输入订单ID"
                    clearable
                    class="!w-[180px]"
                />
            </el-form-item>
            <el-form-item label="三方ID：" prop="out_trade_no">
                <el-input
                    v-model="form.out_trade_no"
                    placeholder="请输入三方ID"
                    clearable
                    class="!w-[180px]"
                />
            </el-form-item>
            <el-form-item label="充值时间：" prop="time_range">
                <el-date-picker
                    v-model="form.time_range"
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
                    <el-option
                        v-for="item in PaymentStatus"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"
                    />
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
import { ref } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useUserStoreHook } from "@/store/modules/user";
import Refresh from "@iconify-icons/ep/refresh";
import { PureTableBar } from "@/components/RePureTableBar";
import { useUserManage } from "./hooks";
import { useRouter } from "vue-router";

const router = useRouter();
const { getEnumOptions } = useUserStoreHook();
const PaymentStatus = getEnumOptions("PaymentStatus");
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
