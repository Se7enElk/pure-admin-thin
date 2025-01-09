<template>
    <div>
        <el-form
            ref="formRef"
            :inline="true"
            :model="form"
            class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
        >
            <el-form-item label="banner名称：" prop="banner_name">
                <el-input
                    v-model="form.banner_name"
                    clearable
                    class="!w-[180px]"
                />
            </el-form-item>
            <el-form-item label="banner ID：" prop="id">
                <el-input v-model="form.id" clearable class="!w-[180px]" />
            </el-form-item>
            <el-form-item label="生效时间：" prop="time">
                <el-date-picker v-model="form.time" type="daterange" />
            </el-form-item>
            <el-form-item label="上架状态：" prop="status">
                <el-select v-model="form.status" clearable class="!w-[180px]">
                    <el-option label="全部" value="2" />
                    <el-option label="上架" value="1" />
                    <el-option label="下架" value="0" />
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
            <template #buttons>
                <el-button
                    type="primary"
                    :icon="useRenderIcon(AddFill)"
                    @click="openDialog()"
                >
                    添加
                </el-button>
            </template>

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
                        <el-button type="primary" text @click="handleEdit(row)">
                            编辑
                        </el-button>
                        <el-button
                            v-if="row.status === 0"
                            type="danger"
                            text
                            style="margin-left: 0"
                            @click="handleStatus(row)"
                        >
                            上架
                        </el-button>
                        <el-button
                            v-if="row.status === 1"
                            type="danger"
                            text
                            style="margin-left: 0"
                            @click="handleStatus(row)"
                        >
                            下架
                        </el-button>
                        <el-button
                            type="danger"
                            text
                            style="margin-left: 0"
                            @click="deleteBannerDialog(row)"
                        >
                            删除
                        </el-button>
                    </template>
                </pure-table>
            </template>
        </PureTableBar>
        <div v-if="dialogVisible">
            <BannerDialog
                v-model="dialogVisible"
                :onSearch="onSearch"
                :launchItem="launchItem"
            />
        </div>

        <DeleteBannerDialog
            v-model="deleteBannerVisible"
            :launchItem="launchItem"
            :onSearch="onSearch"
        />
    </div>
</template>

<script setup lang="ts">
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useUserStoreHook } from "@/store/modules/user";
import Refresh from "@iconify-icons/ep/refresh";
import { PureTableBar } from "@/components/RePureTableBar";
import { useTraffick } from "./hook";
import AddFill from "@iconify-icons/ri/add-circle-line";
import BannerDialog from "./components/BannerDialog.vue";
import DeleteBannerDialog from "./components/DeleteBannerDialog.vue";

const UserLabel = useUserStoreHook().getEnumOptions("UserLabel");
const {
    form,
    formRef,
    dataList,
    loading,
    onSearch,
    resetForm,
    columns,
    pagination,
    dialogVisible,
    launchItem,
    handleEdit,
    handleStatus,
    openDialog,
    deleteBannerVisible,
    deleteBannerDialog,
    handleSizeChange,
    handleCurrentChange
} = useTraffick();
</script>
