import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import {
    getCharacterDetail,
    getUserChatCharacterList,
    getCharacterPhoto
} from "@/api/character";
import { message } from "@/utils/message";

export function useCharacterDetail() {
    const route = useRoute();
    const form = ref({
        character_id: ""
    });

    const formRef = ref();
    const loading = ref(true);

    // 使用定义的接口作为类型
    const characterInfo = ref({
        character_id: "",
        avatars: [],
        character_name: "",
        character_gender: "",
        introduction: "",
        greeting: "",
        setting: "",
        scenario: "",
        rating: ""
    });

    const userInfo = ref({
        uid: "",
        nick_name: "",
        avatar: "",
        id_number: ""
    });

    function resetForm(formEl) {
        if (!formEl) return;
        formEl.resetFields();
        onSearch();
        characterInfo.value = {
            character_id: "",
            avatars: [],
            character_name: "",
            character_gender: "",
            introduction: "",
            greeting: "",
            setting: "",
            scenario: "",
            rating: ""
        };
    }

    async function onSearch() {
        loading.value = true;
        try {
            const res = await getCharacterDetail(form.value);
            if (res.status === 200) {
                loading.value = false;
                if (res.data.character_info_vo) {
                    characterInfo.value = res.data.character_info_vo;
                    userInfo.value = res.data.creator_vo;
                } else {
                    message("角色不存在", {
                        type: "error"
                    });
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    const chatColumns: TableColumnList = [
        {
            label: "角色头像",
            prop: "avatar",
            minWidth: 120,
            cellRenderer: ({ row }) => {
                return (
                    <el-image
                        fit="cover"
                        preview-teleported={true}
                        src={row.creator_avatar}
                        preview-src-list={[row.creator_avatar]}
                        class="w-[24px] h-[24px] rounded-full align-middle"
                    />
                );
            },
            width: 90
        },
        {
            label: "用户昵称",
            prop: "creator_name",
            minWidth: 120
        },
        {
            label: "UID",
            prop: "uid",
            minWidth: 120
        },
        {
            label: "用户ID",
            prop: "id_number",
            minWidth: 120
        },
        {
            label: "用户发送消息数",
            prop: "chat_count",
            minWidth: 120
        },
        {
            label: "角色回复消息数",
            prop: "reply_count",
            minWidth: 120
        },
        {
            label: "生成的照片数",
            minWidth: 120,
            prop: "character_album_count",
            cellRenderer: ({ row }) => {
                return (
                    <el-button
                        link
                        type="primary"
                        size="small"
                        onClick={() => showPhotoDialog(row.character_id)}
                    >
                        {row.image_count}
                    </el-button>
                );
            }
        },
        {
            label: "生成语音数",
            prop: "voice_count",
            minWidth: 120
        },
        {
            label: "操作",
            fixed: "right",
            width: 200,
            slot: "operation"
        }
    ];

    const chatLoading = ref(false);
    const chatData = ref([]);
    const chatPagination = ref({
        total: 1,
        pageSize: 20,
        currentPage: 1,
        background: true
    });

    const chatForm = ref({
        page: 1,
        size: 20,
        character_id: ""
    });

    async function getCharacterData() {
        chatLoading.value = true;
        try {
            chatForm.value.character_id = characterInfo.value.character_id;
            const res = await getUserChatCharacterList(chatForm.value);
            if (res.status === 200) {
                chatData.value = res.data.content;
                chatPagination.value.total = res.data.total;
                chatLoading.value = false;
            }
        } catch (error) {
            console.error(error);
        } finally {
            chatLoading.value = false;
        }
    }

    function handleChatSizeChange(size: number) {
        chatPagination.value.pageSize = size;
        chatForm.value.page = 1;
        chatForm.value.size = size;
        getCharacterData();
    }

    function handleChatCurrentChange(current: number) {
        chatPagination.value.currentPage = current;
        chatForm.value.page = current;
        getCharacterData();
    }

    const photoDialog = ref(false);
    const photoData = ref([]);
    const showPhotoDialog = async (id: string) => {
        const res = await getCharacterPhoto({ character_id: id });
        if (res.status === 200) {
            if (res.data?.length) {
                photoData.value = res.data;
                photoDialog.value = true;
            } else {
                photoData.value = [];

                message("角色相册为空", {
                    type: "warning"
                });
            }
        }
    };

    onMounted(async () => {
        if (route?.query?.id) {
            form.value.character_id = route.query.id as string;
            await onSearch();
            await getCharacterData();
        } else {
            loading.value = false;
        }
    });

    return {
        form,
        formRef,
        loading,
        /** 搜索 */
        onSearch,
        /** 重置 */
        resetForm,

        characterInfo,
        userInfo,
        chatColumns,
        getCharacterData,
        chatLoading,
        chatData,
        chatPagination,
        handleChatSizeChange,
        handleChatCurrentChange,

        photoDialog,
        photoData,
        showPhotoDialog
    };
}
