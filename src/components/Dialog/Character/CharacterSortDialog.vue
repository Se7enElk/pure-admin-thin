<!--
 * @Author: Elk
 * @Date: 2025-01-10 19:12:01
 * @FilePath: /lemon9-admin/src/components/Dialog/Character/CharacterSortDialog.vue
 * @Description: 排序角色
-->
<template>
    <base-character-dialog
        v-model="visible"
        title="排序角色"
        :character-info="characterInfo"
        @close="handleClose"
        @save="handleSave"
    >
        <el-form
            ref="formRef"
            :label-width="100"
            :model="formData"
            :rules="rules"
            class="mt-5 mb-5"
            label-position="right"
        >
            <el-form-item label="排序" prop="position">
                <el-input-number v-model="formData.position" />
            </el-form-item>
        </el-form>
    </base-character-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import BaseCharacterDialog from "./BaseCharacterDialog.vue";
import { sortCharacter } from "@/api/character";
import { message } from "@/utils/message";

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

const formRef = ref(null);
const formData = ref({
    position: 0,
    character_id: props.characterInfo.character_id || props.characterInfo.id
});

const rules = {
    position: [{ required: true, message: "请输入排序" }]
};

const visible = computed({
    get: () => props.modelValue,
    set: value => emit("update:modelValue", value)
});

const resetForm = () => {
    formData.value = {
        position: 0,
        character_id: props.characterInfo.character_id || props.characterInfo.id
    };
};

const handleClose = () => {
    emit("update:modelValue", false);
    resetForm();
};

const handleSave = async () => {
    try {
        const valid = await formRef.value.validate();
        if (!valid) return;
        const res = await sortCharacter(formData.value);
        if (res.status === 200) {
            message("排序角色成功", { type: "success" });
            emit("update:modelValue", false);
            emit("success");
        }
    } catch (error) {
        console.log(error);
    }
};
</script>
