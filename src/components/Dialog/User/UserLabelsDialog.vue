<template>
    <base-user-dialog
        v-model="visible"
        title="编辑标签"
        :user-info="userInfo"
        @close="handleClose"
        @save="handleSave"
    >
        <el-form ref="formRef" :model="form" :rules="rules" class="mt-5 ml-5">
            <el-form-item label="标签" prop="labels">
                <el-select
                    v-model="form.labels"
                    multiple
                    placeholder="请选择"
                    class="!w-[200px]"
                >
                    <el-option
                        v-for="item in UserLabel"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"
                    />
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
import { useUserStoreHook } from "@/store/modules/user";

const { getEnumOptions } = useUserStoreHook();
const UserLabel = getEnumOptions("UserLabel");

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
    labels: [],
    type: ""
});

const rules = {
    labels: [{ required: true, message: "请选择标签", trigger: "blur" }]
};

const handleClose = () => {
    emit("update:modelValue", false);
    resetForm();
};

const resetForm = () => {
    form.value = {
        id: "",
        labels: [],
        type: ""
    };
};

const handleSave = async () => {
    try {
        const valid = await formRef.value.validate();
        if (!valid) return;

        form.value.id = props.userInfo.id;
        form.value.type = props.userInfo.type;

        const res = await editUser(form.value);
        if (res.status === 200) {
            message("添加标签成功", { type: "success" });
            emit("update:modelValue", false);
            emit("success");
            resetForm();
        }
    } catch (error) {
        console.log(error);
    }
};
</script>
