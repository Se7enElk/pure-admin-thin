<!--
 * @Author: Elk
 * @Date: 2025-01-10 19:12:01
 * @FilePath: /lemon9-admin/src/components/Dialog/Character/CharacterDeleteDialog.vue
 * @Description: 删除/恢复角色
-->
<template>
    <base-character-dialog
        v-model="visible"
        title="删除角色"
        :character-info="characterInfo"
        @close="handleClose"
        @save="handleSave"
    >
        <el-alert
            title="确定删除这个角色吗"
            type="error"
            effect="dark"
            class="!ml-5 !mt-5 !mb-5 !w-[90%]"
            :closable="false"
        />
    </base-character-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import BaseCharacterDialog from "./BaseCharacterDialog.vue";
import { deleteCharacter } from "@/api/character";
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

const visible = computed({
    get: () => props.modelValue,
    set: value => emit("update:modelValue", value)
});

const handleClose = () => {
    emit("update:modelValue", false);
};

const handleSave = async () => {
    try {
        const res = await deleteCharacter({
            character_id:
                props.characterInfo.character_id || props.characterInfo.id
        });
        if (res.status === 200) {
            message("删除角色成功", { type: "success" });
            emit("update:modelValue", false);
            emit("success");
        }
    } catch (error) {
        console.log(error);
    }
};
</script>
