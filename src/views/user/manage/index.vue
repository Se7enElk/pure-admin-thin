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

        <FreeTimesDialog
            v-model:visible="freeTimesDialogVisible"
            :editRow="editRow"
            @saved="onSearch"
        />

        <VipDialog
            v-model:visible="vipDialogVisible"
            :editRow="editRow"
            @saved="onSearch"
        />

        <CoinDialog
            v-model:visible="coinDialogVisible"
            :editRow="editRow"
            @saved="onSearch"
        />

        <LabelsDialog
            v-model:visible="labelsDialogVisible"
            :editRow="editRow"
            @saved="onSearch"
        />

        <TypeDialog
            v-model:visible="typeDialogVisible"
            :editRow="editRow"
            @saved="onSearch"
        />
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
import { banUser } from "@/api/user";
import { cloneDeep } from "@pureadmin/utils";
import { useRouter } from "vue-router";
import { storageLocal } from "@pureadmin/utils";

// Import dialog components
import {
    FreeTimesDialog,
    VipDialog,
    CoinDialog,
    LabelsDialog,
    TypeDialog
} from "@/components/UserDialogs";

const router = useRouter();
const { getEnumOptions } = useUserStoreHook();
const UserLabel = getEnumOptions("UserLabel");
const editRow = ref(null);
const openDialog = (row: any, type?: string) => {
    editRow.value = cloneDeep(row);
    switch (type) {
        case "freeTimes":
            freeTimesDialogVisible.value = true;
            break;
        case "vip":
            vipDialogVisible.value = true;
            break;
        case "coin":
            coinDialogVisible.value = true;
            break;
        case "ban":
            banDialogVisible.value = true;
            break;
        case "label":
            labelsDialogVisible.value = true;
            break;
        case "type":
            typeDialogVisible.value = true;
            break;
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

// Dialog visibility states
const freeTimesDialogVisible = ref(false);
const vipDialogVisible = ref(false);
const coinDialogVisible = ref(false);
const labelsDialogVisible = ref(false);
const typeDialogVisible = ref(false);
const banDialogVisible = ref(false);

// Ban reason options
const banReason = [
    {
        name: "1. 发布恶意内容、散布仇恨言论、种族歧视、性别歧视等不当言论。",
        value: "1. 发布恶意内容、散布仇恨言论、种族歧视、性别歧视等不当言论。"
    },
    {
        name: "2. 大量发布无关广告、链接或重复内容，扰乱平台的正常秩序。",
        value: "2. 大量发布无关广告、链接或重复内容，扰乱平台的正常秩序。"
    },
    {
        name: "3. 利用平台进行诈骗等不当行为。",
        value: "3. 利用平台进行诈骗等不当行为。"
    },
    {
        name: "4. 发布非法内容，如色情、暴力、毒品或其他违反法律的行为。",
        value: "4. 发布非法内容，如色情、暴力、毒品或其他违反法律的行为。"
    },
    {
        name: "5. 上传未经授权的受版权保护的内容，如盗版电影、音乐、书籍等。",
        value: "5. 上传未经授权的受版权保护的内容，如盗版电影、音乐、书籍等。"
    },
    {
        name: "6. 侵犯其他用户或公司的知识产权，如未经许可使用商标或专利。",
        value: "6. 侵犯其他用户或公司的知识产权，如未经许可使用商标或专利。"
    },
    {
        name: "7. 其他",
        value: "7. 其他"
    }
];

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
