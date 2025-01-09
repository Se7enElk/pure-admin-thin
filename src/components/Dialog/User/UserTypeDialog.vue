<template>
    <base-user-dialog
        v-model="visible"
        title="编辑用户类型"
        :user-info="userInfo"
        @close="handleClose"
        @save="handleSave"
    >
        <el-form ref="formRef" :model="form" :rules="rules" class="mt-5 ml-5">
            <el-form-item label="用户类型" prop="type">
                <el-select
                    v-model="form.type"
                    class="!w-[200px]"
                    placeholder="请选择"
                >
                    <el-option label="创作者" value="CREATOR" />
                    <el-option label="普通用户" value="USER" />
                </el-select>
            </el-form-item>
        </el-form>
    </base-user-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import BaseUserDialog from "./BaseUserDialog.vue";
import { editUser } from "@/api/user";
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
    id: "",
    type: ""
});

const rules = {
    type: [{ required: true, message: "请选择用户类型", trigger: "blur" }]
};

const handleClose = () => {
    emit("update:modelValue", false);
    resetForm();
};

const resetForm = () => {
    form.value = {
        id: "",
        type: ""
    };
};

const handleSave = async () => {
    try {
        const valid = await formRef.value.validate();
        if (!valid) return;

        form.value.id = props.userInfo.id;

        const res = await editUser(form.value);
        if (res.status === 200) {
            message("编辑用户成功", { type: "success" });
            emit("update:modelValue", false);
            emit("success");
            resetForm();
        }
    } catch (error) {
        console.log(error);
    }
};
</script>
