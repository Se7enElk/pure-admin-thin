<template>
    <base-user-dialog
        v-model="visible"
        title="编辑免费次数"
        :user-info="userInfo"
        @close="handleClose"
        @save="handleSave"
    >
        <p class="ml-5 mt-5">
            下次免费次数重置时间：{{
                dayjs(userInfo?.privilege_info?.common_refresh_time).format(
                    "YYYY-MM-DD HH:mm:ss"
                )
            }}
        </p>
        <p class="ml-5 mt-2">
            剩余消息数：{{ userInfo?.privilege_info?.privileges.MESSAGE }}
        </p>
        <p class="ml-5 mt-2">
            剩余图片数：{{ userInfo?.privilege_info?.privileges.PHOTO }}
        </p>
        <p class="ml-5 mt-2">
            剩余语音数：{{ userInfo?.privilege_info?.privileges.VOICE }}
        </p>
        <p class="ml-5 mt-2">
            剩余润色次数：{{ userInfo?.privilege_info?.privileges?.POLISH }}
        </p>
        <p class="ml-5 mt-2 mb-5">
            剩余解锁图片次数：{{
                userInfo?.privilege_info?.privileges?.UNLOCK_ALBUM
            }}
        </p>

        <el-form ref="formRef" :model="form" :rules="rules">
            <el-form-item label="赠送消息数" prop="privileges.MESSAGE">
                <el-input-number
                    v-model="form.privileges.MESSAGE"
                    class="!w-[200px]"
                />
            </el-form-item>
            <el-form-item label="赠送图片数" prop="privileges.PHOTO">
                <el-input-number
                    v-model="form.privileges.PHOTO"
                    class="!w-[200px]"
                />
            </el-form-item>
            <el-form-item label="赠送语音数" prop="privileges.VOICE">
                <el-input-number
                    v-model="form.privileges.VOICE"
                    class="!w-[200px]"
                />
            </el-form-item>
            <el-form-item label="赠送润色次数" prop="privileges.POLISH">
                <el-input-number
                    v-model="form.privileges.POLISH"
                    class="!w-[200px]"
                />
            </el-form-item>
            <el-form-item
                label="赠送解锁图片次数"
                prop="privileges.UNLOCK_ALBUM"
            >
                <el-input-number
                    v-model="form.privileges.UNLOCK_ALBUM"
                    class="!w-[200px]"
                />
            </el-form-item>
        </el-form>
    </base-user-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import BaseUserDialog from "./BaseUserDialog.vue";
import dayjs from "dayjs";
import { addFreeTimes } from "@/api/user";
import { message } from "@/utils/message";

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    },
    userInfo: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(["update:modelValue", "success"]);

const visible = computed({
    get: () => props.modelValue,
    set: value => emit("update:modelValue", value)
});

const formRef = ref(null);
const form = ref({
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

const rules = {
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

const handleClose = () => {
    emit("update:modelValue", false);
    resetForm();
};

const resetForm = () => {
    form.value = {
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
};

const handleSave = async () => {
    try {
        const valid = await formRef.value.validate();
        if (!valid) return;

        form.value.uid = props.userInfo.id;
        form.value.month = props.userInfo.privilege_info.month;

        const res = await addFreeTimes(form.value);
        if (res.status === 200) {
            message("添加特权次数成功", { type: "success" });
            emit("update:modelValue", false);
            emit("success");
            resetForm();
        }
    } catch (error) {
        console.log(error);
    }
};
</script>
