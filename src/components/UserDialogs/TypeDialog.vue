<template>
    <el-dialog
        v-model="dialogVisible"
        title="编辑用户类型"
        width="50%"
        :before-close="handleClose"
    >
        <div v-if="editRow" class="user-info">
            <img
                v-if="editRow.avatar"
                class="w-[80px] h-[80px] rounded-full mr-4"
                :src="editRow.avatar"
            />
            <div class="info-text">
                <p>用户昵称：{{ editRow.nick_name }}</p>
                <p>用户ID：{{ editRow.id_number }}</p>
                <p>UID：{{ editRow.id }}</p>
            </div>
        </div>

        <el-form
            ref="typeFormRef"
            :model="form"
            :rules="rules"
            class="mt-5 ml-5"
        >
            <el-form-item label="用户类型" prop="type">
                <el-radio-group v-model="form.type">
                    <el-radio :label="1">普通用户</el-radio>
                    <el-radio :label="2">主播</el-radio>
                    <el-radio :label="3">运营</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>

        <template #footer>
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="handleSave">保存</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { message } from "@/utils/message";
import { editUser } from "@/api/user";
import { nextTick } from "vue";
import "./styles.scss";

const props = defineProps<{
    visible: boolean;
    editRow: any;
}>();

const emit = defineEmits<{
    (e: "update:visible", value: boolean): void;
    (e: "saved"): void;
}>();

const dialogVisible = ref(props.visible);

watch(
    () => props.visible,
    val => {
        dialogVisible.value = val;
    }
);

watch(
    () => dialogVisible.value,
    val => {
        emit("update:visible", val);
    }
);

const form = ref({
    type: 1,
    uid: ""
});

const rules = {
    type: [{ required: true, message: "请选择用户类型", trigger: "change" }]
};

const typeFormRef = ref();

const handleClose = () => {
    dialogVisible.value = false;
};

const handleSave = async () => {
    try {
        const valid = await typeFormRef.value.validate();
        if (!valid) return;

        // Set the form values and call API
        const res = await editUser({
            ...form.value,
            id: props.editRow.id
        });

        if (res.status === 200) {
            message("更新用户类型成功", {
                type: "success"
            });
            dialogVisible.value = false;
            emit("saved");

            // Reset form
            nextTick(() => {
                form.value = {
                    type: 1,
                    uid: ""
                };
            });
        }
    } catch (error) {
        console.log(error);
    }
};

// Initialize form with existing type if any
watch(
    () => props.editRow,
    newVal => {
        if (newVal && newVal.type) {
            form.value.type = newVal.type;
        }
    },
    { immediate: true }
);
</script>
