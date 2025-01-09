<template>
    <base-user-dialog
        v-model="visible"
        title="封禁用户"
        :user-info="userInfo"
        @close="handleClose"
        @save="handleSave"
    >
        <el-form ref="formRef" :model="form" :rules="rules" class="mt-5 ml-5">
            <el-form-item label="封禁类型" prop="opt">
                <el-select
                    v-model="form.opt"
                    class="!w-[200px]"
                    placeholder="请选择"
                >
                    <el-option label="封禁" :value="0" />
                    <el-option label="解封" :value="1" />
                </el-select>
            </el-form-item>
            <el-form-item v-if="form.opt === 0" label="封禁时间" prop="hour">
                <el-input-number v-model="form.hour" class="!w-[200px]" />
            </el-form-item>
            <el-form-item label="封禁原因" prop="reason">
                <el-radio-group
                    v-model="form.reason"
                    class="flex flex-col space-y-3"
                >
                    <el-radio
                        v-for="item in banReason"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"
                        class="!mr-0"
                        >{{ item.name }}</el-radio
                    >
                </el-radio-group>
            </el-form-item>
        </el-form>
    </base-user-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import BaseUserDialog from "./BaseUserDialog.vue";
import { banUser } from "@/api/user";
import { message } from "@/utils/message";

const banReason = [
    {
        name: "1. 发布恶意内容、散布仇恨言论、种族歧视、性别歧视等不当言论。",
        value: "1. 发布恶意内容、散布仇恨言论、种族歧视、性别歧视等不当言论。"
    },
    {
        name: "2. 大量发布无关广告、链接或重复内容，扰乱平台的正常秩序。",
        value: "2. 大量发布无关广告、链接或重复内容，扰乱平台的正常秩序。"
    },
    {
        name: "3. 利用平台进行诈骗等不当行为。",
        value: "3. 利用平台进行诈骗等不当行为。"
    },
    {
        name: "4. 发布非法内容，如色情、暴力、毒品或其他违反法律的行为。",
        value: "4. 发布非法内容，如色情、暴力、毒品或其他违反法律的行为。"
    },
    {
        name: "5. 上传未经授权的受版权保护的内容，如盗版电影、音乐、书籍等。",
        value: "5. 上传未经授权的受版权保护的内容，如盗版电影、音乐、书籍等。"
    },
    {
        name: "6. 侵犯其他用户或公司的知识产权，如未经许可使用商标或专利。",
        value: "6. 侵犯其他用户或公司的知识产权，如未经许可使用商标或专利。"
    },
    {
        name: "7. 其他",
        value: "7. 其他"
    }
];

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
    hour: 0,
    opt: 0,
    reason: ""
});

const rules = {
    hour: [{ required: true, message: "请输入封禁时间", trigger: "blur" }],
    reason: [{ required: true, message: "请选择封禁原因", trigger: "blur" }],
    opt: [{ required: true, message: "请选择封禁类型", trigger: "blur" }]
};

const handleClose = () => {
    emit("update:modelValue", false);
    resetForm();
};

const resetForm = () => {
    form.value = {
        id: "",
        hour: 0,
        opt: 0,
        reason: ""
    };
};

const handleSave = async () => {
    try {
        const valid = await formRef.value.validate();
        if (!valid) return;

        form.value.id = props.userInfo.id;

        const res = await banUser(form.value);
        if (res.status === 200) {
            message(form.value.opt === 0 ? "封禁用户成功" : "解封用户成功", {
                type: "success"
            });
            emit("update:modelValue", false);
            emit("success");
            resetForm();
        }
    } catch (error) {
        console.log(error);
    }
};
</script>

<style scoped lang="scss">
:deep(.el-radio) {
    width: 100%;
    text-align: left;
}
</style>
