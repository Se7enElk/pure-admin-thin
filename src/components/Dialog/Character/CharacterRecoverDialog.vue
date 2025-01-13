<!--
 * @Author: Elk
 * @Date: 2025-01-10 19:12:01
 * @FilePath: /lemon9-admin/src/components/Dialog/Character/CharacterRecoverDialog.vue
 * @Description: 删除/恢复角色
-->
<template>
    <base-character-dialog
        v-model="visible"
        title="恢复角色"
        :character-info="characterInfo"
        @close="handleClose"
        @save="handleSave"
    >
        <el-alert
            title="确定恢复这个角色吗"
            type="success"
            effect="dark"
            class="!ml-5 !mt-5 !mb-5 !w-[90%]"
            :closable="false"
        />
    </base-character-dialog>
</template>

<script setup lang="ts">
import { computed } from "vue";
import BaseCharacterDialog from "./BaseCharacterDialog.vue";
import { recoverCharacter } from "@/api/character";
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
        console.log(props.characterInfo);
        const res = await recoverCharacter({
            character_id:
                props.characterInfo.character_id || props.characterInfo.id
        });
        if (res.status === 200) {
            message("恢复角色成功", { type: "success" });
            emit("update:modelValue", false);
            emit("success");
        }
    } catch (error) {
        console.log(error);
    }
};
</script>
