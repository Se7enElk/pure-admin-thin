<template>
    <base-user-dialog
        v-model="visible"
        title="编辑会员"
        :user-info="userInfo"
        @close="handleClose"
        @save="handleSave"
    >
        <p class="ml-5 mt-5">
            当前是否为会员：{{
                userInfo?.privilege_info?.vip.vip ? "是" : "否"
            }}
        </p>
        <p v-if="userInfo?.privilege_info?.vip.vip" class="ml-5 mt-2">
            会员到期时间：{{
                dayjs(userInfo?.privilege_info?.vip.vip_expire_time).format(
                    "YYYY-MM-DD HH:mm:ss"
                )
            }}
        </p>
        <el-form ref="formRef" :model="form" :rules="rules" class="mt-5 ml-5">
            <el-form-item label="会员天数" prop="day">
                <el-input-number v-model="form.day" class="!w-[200px]" />
            </el-form-item>
        </el-form>
    </base-user-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import BaseUserDialog from "./BaseUserDialog.vue";
import dayjs from "dayjs";
import { addVip } from "@/api/user";
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
    day: 0,
    uid: ""
});

const rules = {
    day: [{ required: true, message: "请输入会员天数", trigger: "blur" }]
};

const handleClose = () => {
    emit("update:modelValue", false);
    resetForm();
};

const resetForm = () => {
    form.value = {
        day: 0,
        uid: ""
    };
};

const handleSave = async () => {
    try {
        const valid = await formRef.value.validate();
        if (!valid) return;

        form.value.uid = props.userInfo.id;

        const res = await addVip(form.value);
        if (res.status === 200) {
            message("添加会员成功", { type: "success" });
            emit("update:modelValue", false);
            emit("success");
            resetForm();
        }
    } catch (error) {
        console.log(error);
    }
};
</script>
