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

            <el-form
                ref="freeTimesFormRef"
                :model="freeTimesForm"
                :rules="freeTimesRules"
            >
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
            </el-form>

            <template #footer>
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="handleFreeTimesSave">
                    保存
                </el-button>
            </template>
        </el-dialog>

        <el-dialog
            v-model="vipDialogVisible"
            title="编辑会员"
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
                当前是否为会员：{{
                    editRow?.privilege_info?.vip.vip ? "是" : "否"
                }}
            </p>
            <p v-if="editRow?.privilege_info?.vip.vip" class="ml-5 mt-2">
                会员到期时间：{{
                    dayjs(editRow?.privilege_info?.vip.vip_expire_time).format(
                        "YYYY-MM-DD HH:mm:ss"
                    )
                }}
            </p>
            <el-form
                ref="vipFormRef"
                :model="vipForm"
                :rules="vipRules"
                class="mt-5 ml-5"
            >
                <el-form-item label="会员天数" prop="day">
                    <el-input-number v-model="vipForm.day" class="!w-[200px]" />
                </el-form-item>
            </el-form>

            <template #footer>
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="handleVipSave">
                    保存
                </el-button>
            </template>
        </el-dialog>

        <el-dialog
            v-model="coinDialogVisible"
            title="编辑金币"
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
            <p class="ml-5 mt-5 mb-5">剩余金币数：{{ editRow?.coin }}</p>
            <el-form
                ref="coinFormRef"
                :model="coinForm"
                :rules="coinRules"
                class="mt-5 ml-5"
            >
                <el-form-item label="金币操作类型" prop="account_opt_type">
                    <el-select
                        v-model="coinForm.account_opt_type"
                        class="!w-[200px]"
                        placeholder="请选择"
                    >
                        <el-option label="增加" value="Income" />
                        <el-option label="减少" value="Spend" />
                    </el-select>
                </el-form-item>
                <el-form-item label="金币数量" prop="coin_amount">
                    <el-input-number
                        v-model="coinForm.coin_amount"
                        class="!w-[200px]"
                    />
                </el-form-item>
            </el-form>

            <template #footer>
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="handleCoinSave">
                    保存
                </el-button>
            </template>
        </el-dialog>

        <el-dialog
            v-model="labelsDialogVisible"
            title="编辑标签"
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
            <el-form
                ref="labelsFormRef"
                :model="labelsForm"
                :rules="labelsRules"
                class="mt-5 ml-5"
            >
                <el-form-item label="标签" prop="labels">
                    <el-select
                        v-model="labelsForm.labels"
                        multiple
                        placeholder="请选择"
                        class="!w-[200px]"
                    >
                        <el-option
                            v-for="item in UserLabel"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value"
                    /></el-select>
                </el-form-item>
            </el-form>

            <template #footer>
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="handleLabelsSave">
                    保存
                </el-button>
            </template>
        </el-dialog>

        <el-dialog
            v-model="typeDialogVisible"
            title="编辑用户类型"
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
            <el-form
                ref="typeFormRef"
                :model="typeForm"
                :rules="typeRules"
                class="mt-5 ml-5"
            >
                <el-form-item label="用户类型" prop="type">
                    <el-select
                        v-model="typeForm.type"
                        class="!w-[200px]"
                        placeholder="请选择"
                    >
                        <el-option label="创作者" value="CREATOR" />
                        <el-option label="普通用户" value="USER" />
                    </el-select>
                </el-form-item>
            </el-form>

            <template #footer>
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="handleTypeSave">
                    保存
                </el-button>
            </template>
        </el-dialog>

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
import { addFreeTimes, addVip, coinOperation, editUser } from "@/api/user";
import { getCharacterChatRecord } from "@/api/character";
import { cloneDeep } from "@pureadmin/utils";
import dayjs from "dayjs";
import { message } from "@/utils/message";
import { useUserStoreHook } from "@/store/modules/user";
import { useRoute } from "vue-router";
import type { UserInfo } from "./hooks";
import { PureTableBar } from "@/components/RePureTableBar";

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
    if (type === "freeTimes") {
        const info = userInfo.value;
        freeTimesForm.value = {
            uid: info.id,
            privileges: {
                POLISH: 0,
                UNLOCK_ALBUM: 0,
                VOICE: 0,
                PHOTO: 0,
                MESSAGE: 0
            },
            month: info.privilege_info.month
        };
        freeTimesDialogVisible.value = true;
    } else if (type === "vip") {
        vipForm.value = {
            day: 0,
            uid: userInfo.value.id
        };
        vipDialogVisible.value = true;
    } else if (type === "coin") {
        coinForm.value = {
            uid: userInfo.value.id,
            coin_amount: 0,
            account_opt_type: "Income"
        };
        coinDialogVisible.value = true;
    } else if (type === "label") {
        labelsForm.value = {
            id: userInfo.value.id,
            labels: userInfo.value.labels,
            type: userInfo.value.type
        };
        labelsDialogVisible.value = true;
    } else if (type === "type") {
        typeForm.value = {
            id: userInfo.value.id,
            type: userInfo.value.type
        };
        typeDialogVisible.value = true;
    } else if (type === "chatRecord") {
        chatRecordDialogVisible.value = true;
        chatRecordForm.value.uid = userInfo.value.id;
        chatRecordForm.value.character_id = row.id;

        getChatRecord();
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

const vipDialogVisible = ref(false);
const vipForm = ref({
    day: 0,
    uid: ""
});
const vipRules = {
    day: [{ required: true, message: "请输入会员天数", trigger: "blur" }]
};
const vipFormRef = ref(null);
const handleVipSave = async () => {
    try {
        const valid = await vipFormRef.value.validate();
        if (!valid) return;
        const res = await addVip(vipForm.value);
        if (res.status === 200) {
            message("添加会员成功", {
                type: "success"
            });
            vipDialogVisible.value = false;
            onSearch();
            nextTick(() => {
                editRow.value = null;
                vipForm.value = {
                    day: 0,
                    uid: ""
                };
            });
        }
    } catch (error) {
        console.log(error);
    }
};

const coinDialogVisible = ref(false);
const coinForm = ref({
    uid: "",
    coin_amount: 0,
    account_opt_type: "Income"
});

const coinRules = {
    coin_amount: [
        { required: true, message: "请输入金币数量", trigger: "blur" }
    ],
    account_opt_type: [
        { required: true, message: "请选择金币操作类型", trigger: "blur" }
    ]
};
const coinFormRef = ref(null);
const handleCoinSave = async () => {
    try {
        const valid = await coinFormRef.value.validate();
        if (!valid) return;
        const res = await coinOperation(coinForm.value);
        if (res.status === 200) {
            message("金币操作成功", {
                type: "success"
            });
            coinDialogVisible.value = false;
            onSearch();
            nextTick(() => {
                editRow.value = null;
                coinForm.value = {
                    uid: "",
                    coin_amount: 0,
                    account_opt_type: "Income"
                };
            });
        }
    } catch (error) {
        console.log(error);
    }
};

const labelsDialogVisible = ref(false);
const labelsForm = ref({
    id: "",
    labels: [],
    type: ""
});
const labelsRules = {
    labels: [{ required: true, message: "请选择标签", trigger: "blur" }],
    type: [{ required: true, message: "请选择标签类型", trigger: "blur" }]
};
const labelsFormRef = ref(null);
const handleLabelsSave = async () => {
    try {
        const valid = await labelsFormRef.value.validate();
        if (!valid) return;
        const res = await editUser(labelsForm.value);
        if (res.status === 200) {
            message("添加标签成功", {
                type: "success"
            });
            labelsDialogVisible.value = false;
            onSearch();
            nextTick(() => {
                editRow.value = null;
                labelsForm.value = {
                    id: "",
                    labels: [],
                    type: ""
                };
            });
        }
    } catch (error) {
        console.log(error);
    }
};

const typeDialogVisible = ref(false);
const typeForm = ref({
    id: "",
    type: ""
});
const typeRules = {
    type: [{ required: true, message: "请选择标签类型", trigger: "blur" }]
};
const typeFormRef = ref(null);
const handleTypeSave = async () => {
    try {
        const valid = await typeFormRef.value.validate();
        if (!valid) return;
        const res = await editUser(typeForm.value);
        if (res.status === 200) {
            message("编辑用户成功", {
                type: "success"
            });
        }
        typeDialogVisible.value = false;
        onSearch();
        nextTick(() => {
            editRow.value = null;
            typeForm.value = {
                id: "",
                type: ""
            };
        });
    } catch (error) {
        console.log(error);
    }
};

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
