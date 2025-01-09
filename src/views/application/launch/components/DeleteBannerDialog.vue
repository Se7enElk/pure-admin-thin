<template>
    <el-dialog
        v-model="dialogVisible"
        title="删除Banner"
        width="500"
        :before-close="handleClose"
        style="padding-right: 0; padding-left: 0"
    >
        <div class="delete-wrap">
            <img :src="launchItem.banner_icon" />
            <div class="desc">
                <div>banner名称：{{ launchItem.banner_name }}</div>
                <div>banner ID：{{ launchItem.id }}</div>
            </div>
        </div>
        <div class="delete-desc">确定要删除这个banner吗?</div>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="handleSubmit">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { ElMessageBox, ElMessage } from "element-plus";
import { deleteAddLaunch } from "@/api/application";

const dialogVisible = defineModel({ type: Boolean });
const props = defineProps({
    launchItem: {
        type: Object
    },
    onSearch: {
        type: Function
    }
});
const handleClose = () => {
    dialogVisible.value = false;
};

const handleSubmit = async () => {
    dialogVisible.value = false;
    await deleteAddLaunch({ id: props.launchItem.id });
    ElMessage.success("删除成功");
    props.onSearch();
};
</script>

<style scoped lang="scss">
.delete-wrap {
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        width: 300px;
        height: 200px;
        object-fit: cover;
    }

    .desc {
        margin-left: 20px;
        line-height: 30px;
    }
}

.delete-desc {
    width: 100%;
    padding: 20px 0;
    margin-top: 20px;
    color: rgb(255 3 3);
    text-align: center;
    border: 1px solid rgb(106 106 106 / 25.8%);
    border-right: none;
    border-left: none;
}

.dialog-footer {
    padding: 0 20px;
}
</style>
