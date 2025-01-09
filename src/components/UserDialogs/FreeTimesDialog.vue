<template>
    <el-dialog
        v-model="dialogVisible"
        title="编辑免费次数"
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
            ref="freeTimesFormRef"
            :model="form"
            :rules="rules"
            class="mt-5 ml-5"
        >
            <el-form-item label="赠送消息数" prop="privileges.MESSAGE">
                <el-input-number v-model="form.privileges.MESSAGE" />
            </el-form-item>
            <el-form-item label="赠送图片数" prop="privileges.PHOTO">
                <el-input-number v-model="form.privileges.PHOTO" />
            </el-form-item>
            <el-form-item label="赠送语音数" prop="privileges.VOICE">
                <el-input-number v-model="form.privileges.VOICE" />
            </el-form-item>
            <el-form-item label="赠送擦肩数" prop="privileges.POLISH">
                <el-input-number v-model="form.privileges.POLISH" />
            </el-form-item>
            <el-form-item label="赠送解锁相册数" prop="privileges.UNLOCK_ALBUM">
                <el-input-number v-model="form.privileges.UNLOCK_ALBUM" />
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
import { addFreeTimes } from "@/api/user";
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

const freeTimesFormRef = ref();

const handleClose = () => {
    dialogVisible.value = false;
};

const handleSave = async () => {
    try {
        const valid = await freeTimesFormRef.value.validate();
        if (!valid) return;

        // Set the form values
        form.value.uid = props.editRow.id;
        form.value.month = props.editRow.privilege_info?.month || "";

        const res = await addFreeTimes(form.value);
        if (res.status === 200) {
            message("添加特权次数成功", {
                type: "success"
            });
            dialogVisible.value = false;
            emit("saved");

            // Reset form
            nextTick(() => {
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
            });
        }
    } catch (error) {
        console.log(error);
    }
};
</script>
