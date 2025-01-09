<template>
    <div>
        <el-form
            ref="formRef"
            :inline="true"
            :model="form"
            class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
        >
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

        <template v-if="userInfo && userInfo.id">
            <!-- 用户信息 -->
            <el-card shadow="never" class="mt-2">
                <!-- 用户头像 -->
                <div class="flex items-center mb-8">
                    <img
                        :src="userInfo.avatar"
                        alt="用户头像"
                        class="w-32 h-32 rounded-full"
                    />
                    <div class="ml-4">
                        <p class="text-lg font-bold mb-1">
                            {{ userInfo.nick_name }}
                        </p>
                        <p class="text-sm text-gray-500 mb-1">
                            Lemon9 ID:{{ userInfo.id_number }}
                        </p>
                        <p class="text-sm text-gray-500 mb-1">
                            UID:{{ userInfo.id }}
                        </p>
                        <p class="text-sm text-gray-500 mb-1">
                            注册时间:
                            {{
                                dayjs(userInfo.create_time).format(
                                    "YYYY-MM-DD HH:mm:ss"
                                )
                            }}
                        </p>
                        <p class="text-sm text-gray-500 mb-1">
                            充值金额:
                            <!-- {{ userInfo.privilege_info.common_refresh_time }} -->
                        </p>
                        <p class="text-sm text-gray-500 mb-1">
                            手机号:
                            {{ userInfo.phone }}
                        </p>
                        <p class="text-sm text-gray-500 mb-1">
                            邮箱:
                            {{ userInfo.email }}
                        </p>
                    </div>
                </div>

                <el-descriptions title="基本信息" :column="3" border>
                    <el-descriptions-item label="金币数">{{
                        userInfo.coin
                    }}</el-descriptions-item>
                    <el-descriptions-item label="会员">{{
                        userInfo.privilege_info.vip.vip ? "是" : "否"
                    }}</el-descriptions-item>
                    <el-descriptions-item
                        v-if="userInfo.labels?.length > 0"
                        label="用户标签"
                        >{{
                            userInfo.labels.reduce((prev, curr) => {
                                return (
                                    prev + getEnumNameByValue("UserLabel", curr)
                                );
                            }, "")
                        }}</el-descriptions-item
                    >
                </el-descriptions>
                <el-divider />
                <el-descriptions title="免费聊天信息" :column="3" border>
                    <el-descriptions-item label="剩余普通聊天次数">{{
                        userInfo.privilege_info?.privileges?.MESSAGE
                    }}</el-descriptions-item>
                    <el-descriptions-item label="剩余普通润色次数">{{
                        userInfo.privilege_info?.privileges?.POLISH
                    }}</el-descriptions-item>
                    <el-descriptions-item label="剩余普通语音次数">{{
                        userInfo.privilege_info?.privileges?.VOICE
                    }}</el-descriptions-item>
                    <el-descriptions-item label="剩余普通生图次数">{{
                        userInfo.privilege_info?.privileges?.PHOTO
                    }}</el-descriptions-item>
                    <el-descriptions-item label="剩余普通解锁图片数">{{
                        userInfo.privilege_info?.privileges?.UNLOCK_ALBUM
                    }}</el-descriptions-item>
                </el-descriptions>
                <el-divider />
                <el-descriptions title="Vip聊天信息" :column="3" border>
                    <el-descriptions-item label="剩余VIP聊天次数">{{
                        userInfo.privilege_info?.vip_privileges?.MESSAGE
                    }}</el-descriptions-item>
                    <el-descriptions-item label="剩余VIP润色次数">{{
                        userInfo.privilege_info?.vip_privileges?.POLISH
                    }}</el-descriptions-item>
                    <el-descriptions-item label="剩余VIP语音次数">{{
                        userInfo.privilege_info?.vip_privileges?.VOICE
                    }}</el-descriptions-item>
                    <el-descriptions-item label="剩余VIP生图次数">{{
                        userInfo.privilege_info?.vip_privileges?.PHOTO
                    }}</el-descriptions-item>
                    <el-descriptions-item label="剩余VIP解锁图片数">{{
                        userInfo.privilege_info?.vip_privileges?.UNLOCK_ALBUM
                    }}</el-descriptions-item>
                </el-descriptions>
                <el-divider />
                <el-descriptions title="角色互动信息" :column="3" border>
                    <el-descriptions-item label="创建角色数量">{{
                        userInfo.statistics.character_count
                    }}</el-descriptions-item>
                    <el-descriptions-item label="聊天角色数量">{{
                        userInfo.statistics.character
                    }}</el-descriptions-item>
                    <el-descriptions-item label="发送消息数量">{{
                        userInfo.statistics.message_count
                    }}</el-descriptions-item>
                    <el-descriptions-item label="生成图片数量">{{
                        userInfo.statistics.image_count
                    }}</el-descriptions-item>
                    <el-descriptions-item label="生成音频数量">{{
                        userInfo.statistics.tts_count
                    }}</el-descriptions-item>
                </el-descriptions>
            </el-card>
            <!-- 操作按钮组 -->
            <el-card shadow="never" class="mt-2">
                <el-button type="primary" @click="openDialog('vip')"
                    >编辑会员</el-button
                >
                <el-button type="primary" @click="openDialog('coin')"
                    >编辑金币</el-button
                >
                <el-button type="primary" @click="openDialog('freeTimes')"
                    >免费次数</el-button
                >
                <el-button type="primary" @click="openDialog('label')"
                    >设置标签</el-button
                >
                <el-button type="primary" @click="openDialog('type')"
                    >用户类型</el-button
                >
            </el-card>
            <el-card shadow="never" class="mt-2">
                <el-tabs v-model="tabActiveName" @tab-click="handleTabClick">
                    <el-tab-pane :lazy="true" label="创建的角色" name="create">
                        <PureTableBar
                            :columns="createColumns"
                            @refresh="getCharacterData"
                        >
                            <template v-slot="{ size, dynamicColumns }">
                                <pure-table
                                    row-key="id"
                                    align-whole="center"
                                    table-layout="auto"
                                    :loading="createTableLoading"
                                    :size="size"
                                    :data="createData"
                                    :columns="dynamicColumns"
                                    :pagination="{ ...createPagination, size }"
                                    :header-cell-style="{
                                        background:
                                            'var(--el-fill-color-light)',
                                        color: 'var(--el-text-color-primary)'
                                    }"
                                    @page-size-change="handleCreateSizeChange"
                                    @page-current-change="
                                        handleCreateCurrentChange
                                    "
                                >
                                    <template #operation="{ row }">
                                        <el-button
                                            class="reset-margin"
                                            link
                                            type="primary"
                                            :size="size"
                                            @click="
                                                openDialog('chatRecord', row)
                                            "
                                        >
                                            编辑
                                        </el-button>
                                        <el-button
                                            class="reset-margin"
                                            link
                                            type="primary"
                                            :size="size"
                                            @click="
                                                openDialog('chatRecord', row)
                                            "
                                        >
                                            详情
                                        </el-button>
                                        <el-button
                                            class="reset-margin"
                                            link
                                            type="primary"
                                            :size="size"
                                            @click="
                                                openDialog('chatRecord', row)
                                            "
                                        >
                                            排序
                                        </el-button>
                                        <el-button
                                            class="reset-margin"
                                            link
                                            type="danger"
                                            :size="size"
                                            @click="
                                                openDialog('chatRecord', row)
                                            "
                                        >
                                            删除
                                        </el-button>
                                    </template>
                                </pure-table>
                            </template>
                        </PureTableBar>
                    </el-tab-pane>
                    <el-tab-pane :lazy="true" label="聊过的角色" name="chat">
                        <PureTableBar
                            :columns="chatColumns"
                            @refresh="getChatData"
                        >
                            <template v-slot="{ size, dynamicColumns }">
                                <pure-table
                                    row-key="id"
                                    align-whole="center"
                                    table-layout="auto"
                                    :loading="chatTableLoading"
                                    :size="size"
                                    :data="chatData"
                                    :columns="dynamicColumns"
                                    :pagination="{ ...chatPagination, size }"
                                    :header-cell-style="{
                                        background:
                                            'var(--el-fill-color-light)',
                                        color: 'var(--el-text-color-primary)'
                                    }"
                                    @page-size-change="handleChatSizeChange"
                                    @page-current-change="
                                        handleChatCurrentChange
                                    "
                                >
                                    <template #operation="{ row }">
                                        <el-button
                                            class="reset-margin"
                                            link
                                            type="primary"
                                            :size="size"
                                            @click="
                                                openDialog('chatRecord', row)
                                            "
                                        >
                                            查看聊天记录
                                        </el-button>
                                    </template>
                                </pure-table>
                            </template>
                        </PureTableBar>
                    </el-tab-pane>
                    <el-tab-pane :lazy="true" label="充值记录" name="record">
                        <PureTableBar
                            :columns="recordColumns"
                            @refresh="getRecordData"
                        >
                            <template v-slot="{ size, dynamicColumns }">
                                <pure-table
                                    row-key="order_id"
                                    align-whole="center"
                                    table-layout="auto"
                                    :loading="recordTableLoading"
                                    :size="size"
                                    :data="recordData"
                                    :columns="dynamicColumns"
                                    :pagination="{ ...recordPagination, size }"
                                    :header-cell-style="{
                                        background:
                                            'var(--el-fill-color-light)',
                                        color: 'var(--el-text-color-primary)'
                                    }"
                                    @page-size-change="handleRecordSizeChange"
                                    @page-current-change="
                                        handleRecordCurrentChange
                                    "
                                />
                            </template>
                        </PureTableBar>
                    </el-tab-pane>
                </el-tabs>
            </el-card>
        </template>

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

        <el-dialog
            v-model="chatRecordDialogVisible"
            title="聊天记录"
            width="50%"
            :before-close="handleClose"
        >
            <!-- 聊天记录 -->
            <div v-for="item in chatRecordData" :key="item.id">
                <p>{{ item.content }}</p>
            </div>
        </el-dialog>

        <el-dialog
            v-model="photoDialog"
            title="角色相册"
            width="80%"
            :before-close="handleClose"
        >
            <div class="grid grid-cols-3 gap-4">
                <div
                    v-for="item in photoData"
                    :key="item.id"
                    class="photo-item"
                >
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

            <template #footer>
                <el-button @click="handleClose">关闭</el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
import { storageLocal } from "@pureadmin/utils";
import { ref, nextTick } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useUserDetail } from "./hooks";
import Refresh from "@iconify-icons/ep/refresh";
import { getCharacterChatRecord } from "@/api/character";
import { cloneDeep } from "@pureadmin/utils";
import dayjs from "dayjs";
import { message } from "@/utils/message";
import { useUserStoreHook } from "@/store/modules/user";
import { useRoute } from "vue-router";
import type { UserInfo } from "./hooks";
import { PureTableBar } from "@/components/RePureTableBar";

// Import dialog components
import {
    FreeTimesDialog,
    VipDialog,
    CoinDialog,
    LabelsDialog,
    TypeDialog
} from "@/components/UserDialogs";

const route = useRoute();
const { getEnumOptions, getEnumNameByValue } = useUserStoreHook();
const UserLabel = getEnumOptions("UserLabel");

const {
    form,
    formRef,
    userInfo,
    loading,
    onSearch,
    resetForm,
    tabActiveName,
    handleTabClick,

    chatColumns,
    chatTableLoading,
    chatData,
    chatPagination,
    handleChatSizeChange,
    handleChatCurrentChange,
    getChatData,

    createColumns,
    createTableLoading,
    createData,
    createPagination,
    handleCreateSizeChange,
    handleCreateCurrentChange,
    getCharacterData,
    createForm,

    photoDialog,
    photoData,
    showPhotoDialog,

    recordColumns,
    recordTableLoading,
    recordData,
    recordPagination,
    handleRecordSizeChange,
    handleRecordCurrentChange,
    getRecordData,
    recordForm
} = useUserDetail();

// 设置form的id 从query中获取
form.value.id = route.query.id as string;

const editRow = ref<UserInfo>({
    privilege_info: {
        privileges: {},
        vip_privileges: {},
        vip: { vip: false },
        common_refresh_time: "",
        month: ""
    },
    labels: [],
    coin: 0,
    nick_name: "",
    id_number: "",
    id: "",
    type: "",
    statistics: {
        character_count: 0,
        character: 0,
        message_count: 0,
        image_count: 0,
        tts_count: 0
    }
});
const openDialog = (type?: string, row?: any) => {
    editRow.value = cloneDeep(userInfo.value);
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
        case "label":
            labelsDialogVisible.value = true;
            break;
        case "type":
            typeDialogVisible.value = true;
            break;
        case "chatRecord":
            chatRecordDialogVisible.value = true;
            chatRecordForm.value.uid = userInfo.value.id;
            chatRecordForm.value.character_id = row.id;
            getChatRecord();
            break;
    }
};

const handleClose = () => {
    freeTimesDialogVisible.value = false;
    vipDialogVisible.value = false;
    coinDialogVisible.value = false;
    labelsDialogVisible.value = false;
    typeDialogVisible.value = false;
    photoDialog.value = false;
};

// Dialog visibility states
const freeTimesDialogVisible = ref(false);
const vipDialogVisible = ref(false);
const coinDialogVisible = ref(false);
const labelsDialogVisible = ref(false);
const typeDialogVisible = ref(false);

// 聊天记录弹窗
const chatRecordDialogVisible = ref(false);
const chatRecordForm = ref({
    uid: "",
    character_id: ""
});
const chatRecordData = ref([]);
const getChatRecord = async () => {
    const res = await getCharacterChatRecord(chatRecordForm.value);
    if (res.status === 200) {
        chatRecordData.value = res.data.content;
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
