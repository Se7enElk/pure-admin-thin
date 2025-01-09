<template>
    <el-dialog
        v-model="dialogVisible"
        :title="launchItem?.id ? '修改Banner' : '添加Banner'"
        width="600"
        :before-close="handleClose"
    >
        <el-form
            ref="ruleFormRef"
            style="max-width: 600px"
            :model="ruleForm"
            :rules="rules"
            label-width="auto"
            class="demo-ruleForm"
            :size="formSize"
            status-icon
        >
            <el-form-item label="banner名称" prop="banner_name">
                <el-input v-model="ruleForm.banner_name" />
            </el-form-item>
            <el-form-item label="banner默认图" prop="banner_icon">
                <el-upload
                    v-model:file-list="fileList"
                    :action="uploadUrl"
                    list-type="picture-card"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                    :on-success="handleAvatarSuccess"
                    :limit="1"
                    :on-change="uploadmgChange"
                    :headers="headers"
                    :class="{ uploadIcon: noneUploadImg }"
                >
                    <template #trigger>
                        <el-icon><Plus /></el-icon>
                    </template>
                </el-upload>
                <el-dialog v-model="imgVisible">
                    <img
                        w-full
                        :src="ruleForm.banner_icon"
                        alt="Preview Image"
                    />
                </el-dialog>
            </el-form-item>
            <el-form-item label="开始时间" prop="start_time">
                <el-date-picker
                    v-model="ruleForm.start_time"
                    type="datetime"
                    placeholder="Pick a Date"
                    format="YYYY/MM/DD HH:mm:ss"
                    value-format="x"
                />
            </el-form-item>
            <el-form-item label="结束时间" prop="end_time">
                <el-date-picker
                    v-model="ruleForm.end_time"
                    type="datetime"
                    placeholder="Pick a Date"
                    format="YYYY/MM/DD HH:mm:ss"
                    value-format="x"
                />
            </el-form-item>
            <el-form-item label="跳转链接" prop="banner_url">
                <el-input v-model="ruleForm.banner_url" type="textarea" />
            </el-form-item>
            <el-form-item label="banner排序" prop="sort_pos">
                <el-input-number v-model="ruleForm.sort_pos" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="resetForm(ruleFormRef)">取消</el-button>
                <el-button type="primary" @click="submitForm(ruleFormRef)">
                    保存
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import { ElMessageBox } from "element-plus";
import type { ComponentSize, FormInstance, FormRules } from "element-plus";
import type { UploadProps } from "element-plus";
import { Plus, Loading } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { getAddLaunchList } from "@/api/application";

import { getToken } from "@/utils/auth";
import { before } from "node:test";

const props = defineProps({
    launchItem: {
        type: Object
    },
    onSearch: {
        type: Function
    }
});
const uploadUrl = ref(
    `${import.meta.env.VITE_BASE_URL}/backend/auth/s3/upload_image`
);
const headers = {
    Authorization: getToken().accessToken
};

interface RuleForm {
    banner_name: string;
    sort_pos: number;
    banner_icon: string;
    start_time: string;
    end_time: string;
    banner_url: string;
}
const formSize = ref<ComponentSize>("default");
const dialogVisible = defineModel({ type: Boolean });
const ruleFormRef = ref<FormInstance>();
const imgVisible = ref(false);
const ruleForm = reactive<RuleForm>({
    banner_name: "",
    sort_pos: 0,
    banner_icon: "",
    start_time: "",
    end_time: "",
    banner_url: ""
});

const rules = reactive<FormRules<RuleForm>>({
    banner_name: [
        {
            required: true,
            trigger: "blur",
            message: "请输入banner名称"
        }
    ],
    banner_icon: [
        {
            required: true,
            trigger: "blur",
            message: "请上传banner默认图"
        }
    ],
    start_time: [
        {
            required: true,
            trigger: "blur",
            message: "请选择开始时间"
        }
    ],
    end_time: [
        {
            required: true,
            trigger: "blur",
            message: "请选择结束时间"
        }
    ],
    // banner_url: [
    //     {
    //         required: true,
    //         trigger: "blur",
    //         message:'请输入跳转链接'
    //     }
    // ],
    sort_pos: [
        {
            required: true,
            trigger: "blur",
            message: "请输入banner排序"
        }
    ]
});

const handlePictureCardPreview: UploadProps["onPreview"] = uploadFile => {
    ruleForm.banner_icon = uploadFile.url!;
    imgVisible.value = true;
};
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            try {
                const id = props.launchItem.id;
                let json: any = {
                    ...ruleForm,
                    start_time: ruleForm.start_time,
                    end_time: ruleForm.end_time
                };
                if (id) {
                    json.id = id;
                }
                const res: any = await getAddLaunchList(json);

                if (res.status === 200) {
                    dialogVisible.value = false;
                    ruleFormRef.value.resetFields();
                    if (id) {
                        ElMessage.success("修改banner成功");
                    } else {
                        ElMessage.success("添加banner成功");
                    }
                    props.onSearch();
                }
            } catch (error) {
                dialogVisible.value = false;
            }
        } else {
            console.log("error submit!", fields);
        }
    });
};

onMounted(() => {
    if (props.launchItem.id && dialogVisible.value) {
        const {
            banner_name,
            sort_pos,
            banner_icon,
            start_time,
            end_time,
            banner_url
        } = props.launchItem;
        ruleForm.banner_name = banner_name;
        ruleForm.sort_pos = sort_pos;
        ruleForm.banner_icon = banner_icon;
        ruleForm.start_time = start_time;
        ruleForm.end_time = end_time;
        ruleForm.banner_url = banner_url;
        if (banner_icon) {
            noneUploadImg.value = true;
        }
        fileList.value = [
            {
                name: banner_name,
                url: banner_icon
            }
        ];
    }
});

const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.resetFields();
    dialogVisible.value = false;
};

const handleClose = () => {
    ruleFormRef.value.resetFields();
    dialogVisible.value = false;
};
const fileList = ref([]);

const noneUploadImg = ref(false);
const uploadmgChange = (file, fileList) => {
    noneUploadImg.value = fileList.length ? true : false;
};
const handleRemove: UploadProps["onRemove"] = () => {
    fileList.value = [];
    ruleForm.banner_icon = "";
    noneUploadImg.value = false;
};

const handleAvatarSuccess: UploadProps["onSuccess"] = (
    response,
    uploadFile
) => {
    ruleForm.banner_icon = response.data.object_url_list[0];
};
</script>

<style lang="scss" scoped>
.uploadIcon ::v-deep .el-upload--picture-card {
    display: none !important;
}

::v-deep.el-input-number--default {
    .el-input__suffix {
        display: none !important;
    }
}
</style>
