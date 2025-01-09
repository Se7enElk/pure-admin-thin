<template>
    <el-dialog
        v-model="dialogVisible"
        title="编辑金币"
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
            ref="coinFormRef"
            :model="form"
            :rules="rules"
            class="mt-5 ml-5"
        >
            <el-form-item label="操作类型" prop="type">
                <el-radio-group v-model="form.type">
                    <el-radio :label="1">增加</el-radio>
                    <el-radio :label="2">减少</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="金币数量" prop="coin">
                <el-input-number v-model="form.coin" :min="0" />
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
import { coinOperation } from "@/api/user";
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
    coin: 0,
    uid: ""
});

const rules = {
    type: [{ required: true, message: "请选择操作类型", trigger: "change" }],
    coin: [{ required: true, message: "请输入金币数量", trigger: "blur" }]
};

const coinFormRef = ref();

const handleClose = () => {
    dialogVisible.value = false;
};

const handleSave = async () => {
    try {
        const valid = await coinFormRef.value.validate();
        if (!valid) return;

        // Set the form values
        form.value.uid = props.editRow.id;

        const res = await coinOperation(form.value);
        if (res.status === 200) {
            message(form.value.type === 1 ? "增加金币成功" : "减少金币成功", {
                type: "success"
            });
            dialogVisible.value = false;
            emit("saved");

            // Reset form
            nextTick(() => {
                form.value = {
                    type: 1,
                    coin: 0,
                    uid: ""
                };
            });
        }
    } catch (error) {
        console.log(error);
    }
};
</script>
