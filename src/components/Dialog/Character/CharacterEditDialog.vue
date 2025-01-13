<!--
 * @Author: Elk
 * @Date: 2025-01-10 19:12:01
 * @FilePath: /lemon9-admin/src/components/Dialog/Character/CharacterEditDialog.vue
 * @Description: 删除/恢复角色
-->
<template>
    <base-character-dialog
        v-model="visible"
        title="编辑角色信息"
        :character-info="characterInfo"
        :show-info="false"
        @close="handleClose"
        @save="handleSave"
    >
        <el-form
            ref="formRef"
            :label-width="100"
            label-position="right"
            :model="formData"
            :rules="rules"
        >
            <el-form-item label="更换角色照片" prop="avatar">
                <el-upload
                    v-model:file-list="formData.avatars"
                    :action="`${baseUrl}/backend/auth/s3/upload_image`"
                    list-type="picture-card"
                    :headers="uploadHeaders"
                    accept=".jpg,.jpeg,.png,.gif,.bmp,.webp"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                    :on-success="handleSuccess"
                >
                    <el-icon><Plus /></el-icon>
                </el-upload>
            </el-form-item>
            <el-form-item label="角色名称" prop="character_name">
                <el-input
                    v-model="formData.character_name"
                    class="!w-[200px]"
                />
            </el-form-item>
            <el-form-item label="角色性别" prop="character_gender">
                <el-select
                    v-model="formData.character_gender"
                    placeholder="请选择角色性别"
                    class="!w-[200px]"
                >
                    <el-option
                        v-for="item in CharacterGender"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>

            <el-form-item label="角色可见人" prop="visibility">
                <el-select
                    v-model="formData.visibility"
                    placeholder="请选择角色可见人"
                    class="!w-[200px]"
                >
                    <el-option label="公开" value="PUBLIC" />
                    <el-option label="私密" value="PRIVATE" />
                </el-select>
            </el-form-item>
            <el-form-item label="是否NSFW" prop="rating">
                <el-select
                    v-model="formData.rating"
                    placeholder="是否NSFW"
                    class="!w-[200px]"
                >
                    <el-option label="NSFW" value="NSFW" />
                    <el-option label="SFW" value="SFW" />
                </el-select>
            </el-form-item>

            <!-- <el-form-item label="角色标签" prop="tags">
                <el-select
                    v-model="formData.tags"
                    placeholder="请选择角色标签"
                    multiple
                    class="!w-[200px]"
                >
                    <el-option label="标签1" value="tag1" />
                    <el-option label="标签2" value="tag2" />
                </el-select>
            </el-form-item> -->
            <el-form-item label="角色简介" prop="introduction">
                <el-input
                    v-model="formData.introduction"
                    :autosize="{ minRows: 4, maxRows: 10 }"
                    type="textarea"
                    class="!w-[400px]"
                />
            </el-form-item>
            <el-form-item label="角色问候语" prop="greeting">
                <el-input
                    v-model="formData.greeting"
                    :autosize="{ minRows: 4, maxRows: 10 }"
                    type="textarea"
                    class="!w-[400px]"
                />
            </el-form-item>
            <el-form-item label="角色详情" prop="setting">
                <el-input
                    v-model="formData.setting"
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 10 }"
                    class="!w-[400px]"
                />
            </el-form-item>
            <el-form-item label="角色背景" prop="scenario">
                <el-input
                    v-model="formData.scenario"
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 10 }"
                    class="!w-[400px]"
                />
            </el-form-item>
        </el-form>
    </base-character-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import BaseCharacterDialog from "./BaseCharacterDialog.vue";
import { editCharacter } from "@/api/character";
import { message } from "@/utils/message";
import type { UploadProps } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import { getToken } from "@/utils/auth";
import { useUserStoreHook } from "@/store/modules/user";

const { getEnumOptions } = useUserStoreHook();
const CharacterGender = getEnumOptions("CharacterGender");

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    },
    characterInfo: {
        type: Object
    }
});

const emit = defineEmits(["update:modelValue", "success"]);

const visible = computed({
    get: () => props.modelValue,
    set: value => emit("update:modelValue", value)
});

const baseUrl = import.meta.env.VITE_BASE_URL;

const uploadHeaders = computed(() => {
    return {
        Authorization: getToken().accessToken
    };
});

const formRef = ref(null);
const formData = ref({
    avatars: [],
    character_gender: "",
    character_name: "",
    character_id: null,
    greeting: "",
    introduction: "",
    rating: "",
    scenario: "",
    setting: "",
    visibility: ""
});

const rules = ref({
    avatars: [{ required: true, message: "请上传角色照片", trigger: "blur" }],
    character_name: [
        { required: true, message: "请输入角色名称", trigger: "blur" }
    ],
    character_gender: [
        { required: true, message: "请选择角色性别", trigger: "blur" }
    ],
    visibility: [
        { required: true, message: "请选择角色可见人", trigger: "blur" }
    ],
    rating: [{ required: true, message: "请选择是否NSFW", trigger: "blur" }],
    introduction: [
        { required: true, message: "请输入角色简介", trigger: "blur" }
    ],
    greeting: [
        { required: true, message: "请输入角色问候语", trigger: "blur" }
    ],
    setting: [{ required: true, message: "请输入角色详情", trigger: "blur" }],
    scenario: [{ required: true, message: "请输入角色背景", trigger: "blur" }]
});

// 监听 characterInfo 变化
watch(
    () => props.characterInfo,
    newInfo => {
        if (newInfo) {
            formData.value = cloneDeep(newInfo);
            if (formData.value.avatars && formData.value.avatars.length > 0) {
                formData.value.avatars = formData.value.avatars.map(item => {
                    return {
                        name: item,
                        url: item
                    };
                });
            }

            console.log(formData.value);
        }
    },
    { immediate: true }
);

// 上传文件
const handleSuccess = (response, file, fileList) => {
    if (response.status === 200) {
        // 更新整个avatars数组，避免重复
        formData.value.avatars = fileList.map(file => ({
            name: file.response?.data?.object_url_list?.[0] || file.url,
            url: file.response?.data?.object_url_list?.[0] || file.url
        }));
    } else {
        // 上传失败时给出提示
        message("上传图片失败", { type: "error" });
    }
};

const dialogImageUrl = ref("");
const dialogVisible = ref(false);

const handleRemove: UploadProps["onRemove"] = (file, fileList) => {
    formData.value.avatars = fileList;
};

const handlePictureCardPreview: UploadProps["onPreview"] = uploadFile => {
    dialogImageUrl.value = uploadFile.url!;
    dialogVisible.value = true;
};

const handleClose = () => {
    emit("update:modelValue", false);
};

const handleSave = async () => {
    try {
        const valid = await formRef.value.validate();
        if (!valid) return;

        let options = cloneDeep(formData.value);
        options.avatars = options.avatars.map(item => item.url);

        const res = await editCharacter(options);
        if (res.status === 200) {
            message("编辑角色成功", { type: "success" });
            emit("update:modelValue", false);
            emit("success");
        } else {
            message("编辑角色失败", { type: "error" });
        }
    } catch (error) {
        console.log(error);
    }
};
</script>
