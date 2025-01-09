<template>
    <el-dialog
        v-model="dialogVisible"
        title="编辑会员"
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
            ref="vipFormRef"
            :model="form"
            :rules="rules"
            class="mt-5 ml-5"
        >
            <el-form-item label="会员天数" prop="day">
                <el-input-number v-model="form.day" :min="0" />
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
import { addVip } from "@/api/user";
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
    day: 0,
    uid: ""
});

const rules = {
    day: [{ required: true, message: "请输入会员天数", trigger: "blur" }]
};

const vipFormRef = ref();

const handleClose = () => {
    dialogVisible.value = false;
};

const handleSave = async () => {
    try {
        const valid = await vipFormRef.value.validate();
        if (!valid) return;

        // Set the form values
        form.value.uid = props.editRow.id;

        const res = await addVip(form.value);
        if (res.status === 200) {
            message("添加会员成功", {
                type: "success"
            });
            dialogVisible.value = false;
            emit("saved");

            // Reset form
            nextTick(() => {
                form.value = {
                    day: 0,
                    uid: ""
                };
            });
        }
    } catch (error) {
        console.log(error);
    }
};
</script>
