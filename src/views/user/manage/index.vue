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
            v-model="banDialogVisible"
            title="封禁用户"
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
                ref="banFormRef"
                :model="banForm"
                :rules="banRules"
                class="mt-5 ml-5"
            >
                <el-form-item label="封禁类型" prop="opt">
                    <el-select
                        v-model="banForm.opt"
                        class="!w-[200px]"
                        placeholder="请选择"
                    >
                        <el-option label="封禁" :value="0" />
                        <el-option label="解封" :value="1" />
                    </el-select>
                </el-form-item>
                <el-form-item
                    v-if="banForm.opt === 0"
                    label="封禁时间"
                    prop="hour"
                >
                    <el-input-number
                        v-model="banForm.hour"
                        class="!w-[200px]"
                    />
                </el-form-item>
                <el-form-item label="封禁原因" prop="reason">
                    <el-radio-group
                        v-model="banForm.reason"
                        class="flex flex-col space-y-3"
                    >
                        <el-radio
                            v-for="item in banReason"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value"
                            class="!mr-0"
                            >{{ item.name }}</el-radio
                        >
                    </el-radio-group>
                </el-form-item>
            </el-form>

            <template #footer>
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="handleBanSave">
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
    } else if (type === "vip") {
        vipForm.value = {
            day: 0,
            uid: row.id
        };
        vipDialogVisible.value = true;
    } else if (type === "coin") {
        coinForm.value = {
            uid: row.id,
            coin_amount: 0,
            account_opt_type: "Income"
        };
        coinDialogVisible.value = true;
    } else if (type === "ban") {
        banForm.value = {
            id: row.id,
            hour: 0,
            opt: 0,
            reason: ""
        };
        banDialogVisible.value = true;
    } else if (type === "label") {
        labelsForm.value = {
            id: row.id,
            labels: row.labels,
            type: row.type
        };
        labelsDialogVisible.value = true;
    } else if (type === "type") {
        typeForm.value = {
            id: row.id,
            type: row.type
        };
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
// 1. 发布恶意内容、散布仇恨言论、种族歧视、性别歧视等不当言论。
// 2. 大量发布无关广告、链接或重复内容，扰乱平台的正常秩序。
// 3. 利用平台进行诈骗等不当行为。
// 4. 发布非法内容，如色情、暴力、毒品或其他违反法律的行为。
// 5. 上传未经授权的受版权保护的内容，如盗版电影、音乐、书籍等。
// 6. 侵犯其他用户或公司的知识产权，如未经许可使用商标或专利。
// 7. 其他
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
const banDialogVisible = ref(false);
const banForm = ref({
    id: "",
    hour: 0,
    opt: 0,
    reason: ""
});

const banRules = {
    hour: [{ required: true, message: "请输入封禁时间", trigger: "blur" }],
    reason: [{ required: true, message: "请输入封禁原因", trigger: "blur" }],
    opt: [{ required: true, message: "请选择封禁类型", trigger: "blur" }]
};
const banFormRef = ref(null);
const handleBanSave = async () => {
    try {
        const valid = await banFormRef.value.validate();
        if (!valid) return;
        const res = await banUser(banForm.value);
        if (res.status === 200) {
            message(banForm.value.opt === 0 ? "封禁用户成功" : "解封用户成功", {
                type: "success"
            });
            banDialogVisible.value = false;
            onSearch();
            nextTick(() => {
                editRow.value = null;
                banForm.value = {
                    id: "",
                    hour: 0,
                    opt: 0,
                    reason: ""
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
