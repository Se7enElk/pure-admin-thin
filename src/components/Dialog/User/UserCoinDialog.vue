<template>
    <base-user-dialog
        v-model="visible"
        title="编辑金币"
        :user-info="userInfo"
        @close="handleClose"
        @save="handleSave"
    >
        <p class="ml-5 mt-5 mb-5">剩余金币数：{{ userInfo?.coin }}</p>
        <el-form ref="formRef" :model="form" :rules="rules" class="mt-5 ml-5">
            <el-form-item label="金币操作类型" prop="account_opt_type">
                <el-select
                    v-model="form.account_opt_type"
                    class="!w-[200px]"
                    placeholder="请选择"
                >
                    <el-option label="增加" value="Income" />
                    <el-option label="减少" value="Spend" />
                </el-select>
            </el-form-item>
            <el-form-item label="金币数量" prop="coin_amount">
                <el-input-number
                    v-model="form.coin_amount"
                    class="!w-[200px]"
                />
            </el-form-item>
        </el-form>
    </base-user-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import BaseUserDialog from "./BaseUserDialog.vue";
import { coinOperation } from "@/api/user";
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
    uid: "",
    coin_amount: 0,
    account_opt_type: "Income"
});

const rules = {
    coin_amount: [
        { required: true, message: "请输入金币数量", trigger: "blur" }
    ],
    account_opt_type: [
        { required: true, message: "请选择金币操作类型", trigger: "blur" }
    ]
};

const handleClose = () => {
    emit("update:modelValue", false);
    resetForm();
};

const resetForm = () => {
    form.value = {
        uid: "",
        coin_amount: 0,
        account_opt_type: "Income"
    };
};

const handleSave = async () => {
    try {
        const valid = await formRef.value.validate();
        if (!valid) return;

        form.value.uid = props.userInfo.id;

        const res = await coinOperation(form.value);
        if (res.status === 200) {
            message("金币操作成功", { type: "success" });
            emit("update:modelValue", false);
            emit("success");
            resetForm();
        }
    } catch (error) {
        console.log(error);
    }
};
</script>
