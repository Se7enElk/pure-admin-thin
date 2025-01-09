<template>
    <el-dialog
        v-model="dialogVisible"
        title="编辑标签"
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
            ref="labelsFormRef"
            :model="form"
            :rules="rules"
            class="mt-5 ml-5"
        >
            <el-form-item label="标签" prop="labels">
                <el-select
                    v-model="form.labels"
                    multiple
                    placeholder="请选择标签"
                    clearable
                >
                    <el-option
                        v-for="item in labelOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
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

// Label options - these should match the backend expectations
const labelOptions = [
    { value: "vip", label: "VIP用户" },
    { value: "new", label: "新用户" },
    { value: "active", label: "活跃用户" },
    { value: "inactive", label: "不活跃用户" }
];

const form = ref({
    labels: [] as string[],
    uid: ""
});

const rules = {
    labels: [{ required: true, message: "请选择标签", trigger: "change" }]
};

const labelsFormRef = ref();

const handleClose = () => {
    dialogVisible.value = false;
};

const handleSave = async () => {
    try {
        const valid = await labelsFormRef.value.validate();
        if (!valid) return;

        // Set the form values
        form.value.uid = props.editRow.id;

        const res = await editUser({
            ...form.value,
            id: props.editRow.id
        });

        if (res.status === 200) {
            message("更新标签成功", {
                type: "success"
            });
            dialogVisible.value = false;
            emit("saved");

            // Reset form
            nextTick(() => {
                form.value = {
                    labels: [],
                    uid: ""
                };
            });
        }
    } catch (error) {
        console.log(error);
    }
};

// Initialize form with existing labels if any
watch(
    () => props.editRow,
    newVal => {
        if (newVal && newVal.labels) {
            form.value.labels = [...newVal.labels];
        }
    },
    { immediate: true }
);
</script>
