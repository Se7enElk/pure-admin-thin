import dayjs from "dayjs";
import { reactive, ref, onMounted } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import { useUserStoreHook } from "@/store/modules/user";
import { getUserList } from "@/api/user";

const getEnumNameByValue = useUserStoreHook().getEnumNameByValue;
export function useUserManage() {
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
            label: "UID",
            prop: "id",
            width: 90,
            align: "left"
        },
        {
            label: "用户ID",
            prop: "id_number",
            minWidth: 90
        },
        {
            label: "用户昵称",
            minWidth: 120,
            prop: "nick_name"
        },
        {
            label: "头像",
            prop: "avatar",
            minWidth: 120,
            cellRenderer: ({ row }) => (
                <el-image
                    fit="cover"
                    preview-teleported={true}
                    src={row.avatar}
                    preview-src-list={Array.of(row.avatar)}
                    class="w-[24px] h-[24px] rounded-full align-middle"
                />
            ),
            width: 90
        },
        {
            label: "邮箱",
            prop: "email",
            width: 120
        },
        {
            label: "手机号",
            prop: "phone",
            width: 120
        },
        {
            label: "标签",
            prop: "labels",
            width: 120,
            // 遍历row.labels 每一项使用el-tag包裹
            cellRenderer: ({ row }) => {
                if (row.labels && row.labels.length > 0) {
                    return row.labels.map((label: string) => (
                        <el-tag key={label}>
                            {getEnumNameByValue("UserLabel", label)}
                        </el-tag>
                    ));
                } else {
                    return <span>无</span>;
                }
            }
        },
        {
            label: "创建角色数量",
            prop: "role_count",
            minWidth: 120,
            cellRenderer: ({ row }) => {
                return <span>{row?.statistics?.character_count}</span>;
            }
        },
        {
            label: "聊天角色数量",
            prop: "role_count",
            minWidth: 120,
            cellRenderer: ({ row }) => {
                return <span>{row?.statistics?.character}</span>;
            }
        },
        {
            label: "生成图片数",
            prop: "image_count",
            minWidth: 120,
            cellRenderer: ({ row }) => {
                return <span>{row?.statistics?.image_count}</span>;
            }
        },
        {
            label: "发送消息数量",
            prop: "message_count",
            minWidth: 120,
            cellRenderer: ({ row }) => {
                return <span>{row?.statistics?.message_count}</span>;
            }
        },
        {
            label: "会员时间",
            prop: "vip",
            minWidth: 120,
            cellRenderer: ({ row }) => {
                if (row?.privilege_info?.vip?.vip) {
                    return (
                        <span>
                            <p>会员</p>
                            {dayjs(
                                row?.privilege_info?.vip?.vip_expire_time
                            ).format("YYYY-MM-DD HH:mm:ss")}
                            <p>到期</p>
                        </span>
                    );
                } else {
                    return <span>不是会员</span>;
                }
            }
        },
        {
            label: "金币数",
            prop: "coin",
            minWidth: 120
        },
        {
            label: "剩余普通聊天次数",
            prop: "normal_chat_count",
            minWidth: 120,
            cellRenderer: ({ row }) => {
                if (row?.privilege_info?.privileges?.MESSAGE) {
                    return (
                        <span>{row?.privilege_info?.privileges?.MESSAGE}</span>
                    );
                } else {
                    return <span>无</span>;
                }
            }
        },
        {
            label: "剩余VIP聊天次数",
            prop: "vip_chat_count",
            minWidth: 120,
            cellRenderer: ({ row }) => {
                if (row?.privilege_info?.vip_privileges?.MESSAGE) {
                    return (
                        <span>
                            {row?.privilege_info?.vip_privileges?.MESSAGE}
                        </span>
                    );
                } else {
                    return <span>无</span>;
                }
            }
        },
        {
            label: "剩余普通润色次数",
            prop: "normal_color_count",
            minWidth: 120,
            cellRenderer: ({ row }) => {
                if (row?.privilege_info?.privileges?.POLISH) {
                    return (
                        <span>{row?.privilege_info?.privileges?.POLISH}</span>
                    );
                } else {
                    return <span>无</span>;
                }
            }
        },
        {
            label: "剩余VIP润色次数",
            prop: "vip_color_count",
            minWidth: 120,
            cellRenderer: ({ row }) => {
                if (row?.privilege_info?.vip_privileges?.POLISH) {
                    return (
                        <span>
                            {row?.privilege_info?.vip_privileges?.POLISH}
                        </span>
                    );
                } else {
                    return <span>无</span>;
                }
            }
        },
        {
            label: "剩余普通生图数",
            prop: "normal_image_count",
            minWidth: 120,
            cellRenderer: ({ row }) => {
                if (row?.privilege_info?.privileges?.PHOTO) {
                    return (
                        <span>{row?.privilege_info?.privileges?.PHOTO}</span>
                    );
                } else {
                    return <span>无</span>;
                }
            }
        },
        {
            label: "剩余VIP生图数",
            prop: "vip_image_count",
            minWidth: 120,
            cellRenderer: ({ row }) => {
                return (
                    <span>{row?.privilege_info?.vip_privileges?.PHOTO}</span>
                );
            }
        },
        {
            label: "剩余普通解锁图片数",
            prop: "normal_image_count",
            minWidth: 120,
            cellRenderer: ({ row }) => {
                if (row?.privilege_info?.privileges?.UNLOCK_ALBUM) {
                    return (
                        <span>
                            {row?.privilege_info?.privileges?.UNLOCK_ALBUM}
                        </span>
                    );
                } else {
                    return <span>无</span>;
                }
            }
        },
        {
            label: "剩余VIP解锁图片数",
            prop: "vip_image_count",
            minWidth: 120,
            cellRenderer: ({ row }) => {
                return (
                    <span>
                        {row?.privilege_info?.vip_privileges?.UNLOCK_ALBUM}
                    </span>
                );
            }
        },
        {
            label: "剩余普通语音次数",
            prop: "normal_color_count",
            minWidth: 120,
            cellRenderer: ({ row }) => {
                if (row?.privilege_info?.privileges?.VOICE) {
                    return (
                        <span>{row?.privilege_info?.privileges?.VOICE}</span>
                    );
                } else {
                    return <span>无</span>;
                }
            }
        },
        {
            label: "剩余VIP语音次数",
            prop: "vip_voice_count",
            minWidth: 120,
            cellRenderer: ({ row }) => {
                if (row?.privilege_info?.vip_privileges?.VOICE) {
                    return (
                        <span>
                            {row?.privilege_info?.vip_privileges?.VOICE}
                        </span>
                    );
                } else {
                    return <span>无</span>;
                }
            }
        },
        {
            label: "下次免费次数重置时间",
            prop: "normal_color_count",
            minWidth: 120,
            cellRenderer: ({ row }) => {
                if (row?.privilege_info?.common_refresh_time) {
                    return (
                        <span>
                            {dayjs(
                                row?.privilege_info?.common_refresh_time
                            ).format("YYYY-MM-DD HH:mm:ss")}
                        </span>
                    );
                } else {
                    return <span>无</span>;
                }
            }
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
            const res = await getUserList(form.value);
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
        handleCurrentChange
    };
}
