import { reactive, ref, onMounted } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import { getCharacterList, getCharacterPhoto } from "@/api/character";
import { message } from "@/utils/message";

export function useUserManage() {
    const form = ref({
        character_name: "",
        character_id: "",
        creator_name: "",
        uid: "",
        id_number: "",
        page: 1,
        size: 20
    });
    const pagination = reactive<PaginationProps>({
        total: 1,
        pageSize: 20,
        currentPage: 1,
        background: true
    });

    const formRef = ref();
    const dataList = ref([]);
    const loading = ref(true);
    const total = ref(0);
    const columns: TableColumnList = [
        {
            label: "角色ID",
            prop: "id",
            width: 90,
            align: "left"
        },
        {
            label: "角色头像",
            prop: "avatars",
            minWidth: 180,
            cellRenderer: ({ row }) => {
                if (row.avatars && row.avatars.length > 0) {
                    return (
                        // 固定高度80px
                        <el-image
                            fit="cover"
                            preview-teleported={true}
                            src={row.avatars[0]}
                            preview-src-list={Array.of(row.avatars[0])}
                            class="w-[80px] h-[80px] rounded-full align-middle"
                        />
                    );
                } else {
                    return <span>无</span>;
                }
            }
        },
        {
            label: "角色名称",
            prop: "character_name",
            minWidth: 90
        },
        {
            label: "创建人UID",
            minWidth: 120,
            prop: "uid"
        },
        {
            label: "创建人用户ID",
            minWidth: 120,
            prop: "id_number"
        },
        {
            label: "创建人昵称",
            minWidth: 120,
            prop: "creator_name"
        },
        {
            label: "发消息人数",
            prop: "chat_uv",
            width: 120
        },
        {
            label: "角色照片",
            prop: "character_album_count",
            width: 120,
            cellRenderer: ({ row }) => {
                return (
                    <el-button
                        link
                        type="primary"
                        size="small"
                        onClick={() => showPhotoDialog(row.id)}
                    >
                        {row.character_album_count}
                    </el-button>
                );
            }
        },
        {
            label: "收到消息数",
            prop: "chat_count",
            minWidth: 120
        },
        {
            label: "生成图片人数",
            prop: "image_uv",
            minWidth: 120
        },
        {
            label: "生成语音人数",
            prop: "voice_uv",
            minWidth: 120
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

    function resetForm(formEl) {
        if (!formEl) return;
        formEl.resetFields();
        onSearch();
    }

    async function onSearch() {
        loading.value = true;
        try {
            const res = await getCharacterList(form.value);
            if (res.status === 200) {
                dataList.value = res.data.content;
                total.value = res.data.total;
                loading.value = false;

                pagination.total = res.data.total;
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleSizeChange = (size: number) => {
        pagination.pageSize = size;
        form.value.page = 1;
        form.value.size = size;
        onSearch();
    };

    const handleCurrentChange = (current: number) => {
        pagination.currentPage = current;
        form.value.page = current;
        form.value.size = pagination.pageSize;
        onSearch();
    };

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

    onMounted(() => {
        onSearch();
    });

    return {
        form,
        formRef,
        loading,
        columns,
        dataList,
        /** 搜索 */
        onSearch,
        /** 重置 */
        resetForm,
        pagination,
        handleSizeChange,
        handleCurrentChange,

        photoDialog,
        photoData,
        showPhotoDialog
    };
}
