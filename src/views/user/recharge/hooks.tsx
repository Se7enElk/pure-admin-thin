import dayjs from "dayjs";
import { reactive, ref, onMounted } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import { useUserStoreHook } from "@/store/modules/user";
import { getUserRecord } from "@/api/user";
import { cloneDeep } from "@pureadmin/utils";

const getEnumNameByValue = useUserStoreHook().getEnumNameByValue;
export function useUserManage() {
    const form = ref({
        nick_name: "",
        id_number: "",
        uid: "",
        order_id: "",
        out_trade_no: "",
        status: "",
        start_time: 0,
        end_time: 0,
        time_range: [],
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
            label: "订单ID",
            prop: "order_id"
        },
        {
            label: "三方订单ID",
            prop: "out_trade_no"
        },
        {
            label: "用户昵称",
            prop: "nick_name"
        },
        {
            label: "用户ID",
            prop: "id_number"
        },
        {
            label: "UID",
            prop: "uid"
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

    function resetForm(formEl) {
        if (!formEl) return;
        formEl.resetFields();
        onSearch();
    }

    async function onSearch() {
        loading.value = true;
        try {
            if (form.value.time_range.length > 0) {
                form.value.start_time = new Date(
                    form.value.time_range[0]
                ).getTime();
                form.value.end_time = new Date(
                    form.value.time_range[1]
                ).getTime();
            }
            let options = cloneDeep(form.value);
            delete options.time_range;
            const res = await getUserRecord(options);
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
