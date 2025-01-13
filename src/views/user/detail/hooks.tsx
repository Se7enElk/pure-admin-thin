import dayjs from "dayjs";
import { ref, onMounted } from "vue";
import { getUserList, getUserRecord } from "@/api/user";
import { useRoute } from "vue-router";
import {
    getCharacterList,
    getUserChatCharacterList,
    getCharacterPhoto
} from "@/api/character";
import type { TabsPaneContext } from "element-plus";
import { message } from "@/utils/message";
import { useUserStoreHook } from "@/store/modules/user";
const getEnumNameByValue = useUserStoreHook().getEnumNameByValue;

// 首先定义用户信息的接口
interface UserInfo {
    privilege_info: {
        privileges: Record<string, number>;
        vip_privileges: Record<string, number>;
        vip: {
            vip: boolean;
            vip_expire_time?: string;
        };
        common_refresh_time?: string;
        month?: string;
    };
    create_time?: string;
    labels: string[];
    coin: number;
    nick_name: string;
    id_number: string;
    id: string;
    type: string;
    avatar?: string;
    phone?: string;
    email?: string;
    statistics: {
        character_count: number;
        character: number;
        message_count: number;
        image_count: number;
        tts_count: number;
    };
}

// 导出接口以便其他文件使用
export type { UserInfo };

export function useUserDetail() {
    const route = useRoute();
    const form = ref({
        nick_name: "",
        id_number: "",
        id: "",
        labels: [],
        type: "",
        vip: null,
        page: 1,
        size: 20
    });

    const formRef = ref();
    const loading = ref(true);

    // 使用定义的接口作为类型
    const userInfo = ref<UserInfo>({
        privilege_info: {
            privileges: {},
            vip_privileges: {},
            vip: { vip: false },
            common_refresh_time: ""
        },
        labels: [],
        coin: 0,
        nick_name: "",
        id_number: "",
        id: "",
        type: "",
        statistics: {
            character_count: 0,
            character: 0,
            message_count: 0,
            image_count: 0,
            tts_count: 0
        }
    });

    function resetForm(formEl) {
        if (!formEl) return;
        formEl.resetFields();
        onSearch();
        createData.value = [];
        chatData.value = [];
        recordData.value = [];

        userInfo.value = {
            privilege_info: {
                privileges: {},
                vip_privileges: {},
                vip: { vip: false },
                common_refresh_time: ""
            },
            labels: [],
            coin: 0,
            nick_name: "",
            id_number: "",
            id: "",
            type: "",
            statistics: {
                character_count: 0,
                character: 0,
                message_count: 0,
                image_count: 0,
                tts_count: 0
            }
        };
    }

    async function onSearch() {
        loading.value = true;
        try {
            const res = await getUserList(form.value);
            if (res.status === 200) {
                loading.value = false;
                if (res.data.content.length) {
                    if (form.value.id || form.value.id_number) {
                        userInfo.value = res.data.content[0];

                        if (createData.value.length === 0) {
                            getCharacterData();
                        }
                    }
                } else {
                    message("用户不存在", {
                        type: "error"
                    });
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    const tabActiveName = ref("create");

    function handleTabClick(tab: TabsPaneContext) {
        if (tab.paneName === "create") {
            getCharacterData();
        } else if (tab.paneName === "chat") {
            getChatData();
        } else if (tab.paneName === "record") {
            getRecordData();
        }
    }

    const createColumns: TableColumnList = [
        {
            label: "角色ID",
            prop: "id",
            minWidth: 120
        },
        {
            label: "角色头像",
            prop: "avatar",
            minWidth: 120,
            cellRenderer: ({ row }) => {
                if (row.avatars && row.avatars.length) {
                    return (
                        <el-image
                            fit="cover"
                            preview-teleported={true}
                            src={row.avatars[0]}
                            preview-src-list={[row.avatars[0]]}
                            class="w-[24px] h-[24px] rounded-full align-middle"
                        />
                    );
                }
                return <span>暂无</span>;
            },
            width: 90
        },
        {
            label: "角色名称",
            minWidth: 120,
            prop: "character_name"
        },
        {
            label: "创建时间",
            minWidth: 120,
            prop: "create_time",
            cellRenderer: ({ row }) => {
                return (
                    <span>
                        {dayjs(row.create_time).format("YYYY-MM-DD HH:mm:ss")}
                    </span>
                );
            }
        },
        {
            label: "角色相册",
            minWidth: 120,
            prop: "character_album_count",
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
            label: "发消息人数",
            minWidth: 120,
            prop: "chat_uv"
        },
        {
            label: "收到消息数",
            minWidth: 120,
            prop: "chat_count"
        },
        {
            label: "生成图片人数",
            minWidth: 120,
            prop: "image_uv"
        },
        {
            label: "生成语音人数",
            minWidth: 120,
            prop: "voice_count"
        },
        {
            label: "操作",
            fixed: "right",
            width: 200,
            slot: "operation"
        }
    ];
    const createForm = ref({
        page: 1,
        size: 20,
        uid: ""
    });
    const createTableLoading = ref(false);
    const createData = ref([]);
    const createPagination = ref({
        total: 1,
        pageSize: 20,
        currentPage: 1,
        background: true
    });

    const handleCreateSizeChange = (size: number) => {
        createPagination.value.pageSize = size;
        createForm.value.page = 1;
        createForm.value.size = size;
        getCharacterData();
    };

    const handleCreateCurrentChange = (current: number) => {
        createPagination.value.currentPage = current;
        createForm.value.page = current;
        getCharacterData();
    };

    async function getCharacterData() {
        createTableLoading.value = true;
        createForm.value.uid = userInfo.value.id;
        try {
            const res = await getCharacterList(createForm.value);
            if (res.status === 200) {
                createData.value = res.data.content;
                createPagination.value.total = res.data.total;
                createTableLoading.value = false;
            }
        } catch (error) {
            console.error(error);
        }
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

    const chatColumns: TableColumnList = [
        {
            label: "角色头像",
            prop: "avatar",
            minWidth: 120,
            cellRenderer: ({ row }) => {
                if (row.avatars && row.avatars.length) {
                    return (
                        <el-image
                            fit="cover"
                            preview-teleported={true}
                            src={row.avatars[0]}
                            preview-src-list={[row.avatars[0]]}
                            class="w-[24px] h-[24px] rounded-full align-middle"
                        />
                    );
                }
                return <span>暂无</span>;
            },
            width: 90
        },
        {
            label: "角色名称",
            minWidth: 120,
            prop: "character_name"
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
            label: "发送的消息数",
            minWidth: 120,
            prop: "chat_count"
        },
        {
            label: "生成的语音数",
            minWidth: 120,
            prop: "voice_count"
        },
        {
            label: "操作",
            fixed: "right",
            width: 200,
            slot: "operation"
        }
    ];

    const chatForm = ref({
        page: 1,
        size: 20,
        uid: ""
    });
    const chatTableLoading = ref(false);
    const chatData = ref([]);
    const chatPagination = ref({
        total: 1,
        pageSize: 20,
        currentPage: 1,
        background: true
    });

    function handleChatSizeChange(size: number) {
        chatPagination.value.pageSize = size;
        chatForm.value.page = 1;
        chatForm.value.size = size;
        getChatData();
    }

    function handleChatCurrentChange(current: number) {
        chatPagination.value.currentPage = current;
        chatForm.value.page = current;
        getChatData();
    }

    async function getChatData() {
        chatTableLoading.value = true;
        chatForm.value.uid = userInfo.value.id;
        try {
            const res = await getUserChatCharacterList(chatForm.value);
            if (res.status === 200) {
                chatData.value = res.data.content;
                chatPagination.value.total = res.data.total;
                chatTableLoading.value = false;
            }
        } catch (error) {
            console.error(error);
        }
    }

    const recordColumns: TableColumnList = [
        {
            label: "订单ID",
            prop: "order_id"
        },
        {
            label: "三方订单ID",
            prop: "out_trade_no"
        },
        {
            label: "充值类型",
            prop: "order_type"
        },
        {
            label: "支付金额",
            prop: "pay_amount"
        },
        {
            label: "支付时间",
            prop: "create_time",
            cellRenderer: ({ row }) => {
                return (
                    <span>
                        {dayjs(row.create_time).format("YYYY-MM-DD HH:mm:ss")}
                    </span>
                );
            }
        },
        {
            label: "订单状态",
            prop: "status",
            cellRenderer: ({ row }) => {
                return (
                    <span>
                        {getEnumNameByValue("PaymentStatus", row.status)}
                    </span>
                );
            }
        }
    ];

    const recordForm = ref({
        page: 1,
        size: 20,
        uid: ""
    });
    const recordTableLoading = ref(false);
    const recordData = ref([]);
    const recordPagination = ref({
        total: 1,
        pageSize: 20,
        currentPage: 1,
        background: true
    });

    function handleRecordSizeChange(size: number) {
        recordPagination.value.pageSize = size;
        recordForm.value.page = 1;
        recordForm.value.size = size;
        getRecordData();
    }

    function handleRecordCurrentChange(current: number) {
        recordPagination.value.currentPage = current;
        recordForm.value.page = current;
        getRecordData();
    }

    async function getRecordData() {
        recordTableLoading.value = true;
        recordForm.value.uid = userInfo.value.id;
        try {
            const res = await getUserRecord(recordForm.value);
            if (res.status === 200) {
                recordData.value = res.data.content;
                recordPagination.value.total = res.data.total;
                recordTableLoading.value = false;
            }
        } catch (error) {
            console.error(error);
        }
    }

    onMounted(async () => {
        if (route?.query?.id) {
            form.value.id = route.query.id as string;
            await onSearch();
            getCharacterData();
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
        userInfo,
        tabActiveName,
        handleTabClick,

        chatColumns,
        chatTableLoading,
        chatData,
        chatPagination,
        handleChatSizeChange,
        handleChatCurrentChange,
        getChatData,
        chatForm,

        createColumns,
        createTableLoading,
        createData,
        createPagination,
        handleCreateSizeChange,
        handleCreateCurrentChange,
        getCharacterData,
        createForm,

        photoDialog,
        photoData,
        showPhotoDialog,

        recordColumns,
        recordTableLoading,
        recordData,
        recordPagination,
        handleRecordSizeChange,
        handleRecordCurrentChange,
        getRecordData,
        recordForm
    };
}
