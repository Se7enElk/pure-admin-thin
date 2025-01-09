import { reactive, ref, onMounted } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import { getLaunchList, getAddLaunchStatus } from "@/api/application";
import dayjs from "dayjs";
import { ElMessage } from "element-plus";

export const useTraffick = () => {
    const form: any = ref({
        banner_name: "",
        id: "",
        status: "",
        time: "",
        start_time: "",
        end_time: "",
        page: 1,
        size: 50
    });
    const pagination = reactive<PaginationProps>({
        total: 1,
        pageSize: 50,
        currentPage: 1,
        background: true,
        pageSizes: [100, 50, 20]
    });

    const formRef = ref();
    const dataList = ref([]);
    const loading = ref(true);
    const total = ref(0);
    const columns: TableColumnList = [
        {
            label: "id",
            prop: "id",
            width: 90,
            align: "left"
        },
        {
            label: "banner名称",
            prop: "banner_name",
            minWidth: 90
        },
        {
            label: "banner图片",
            minWidth: 120,
            prop: "banner_icon",
            cellRenderer: ({ row }) => (
                <el-image
                    fit="contain"
                    preview-src-list={Array.of(row.banner_icon)}
                    preview-teleported={true}
                    src={row.banner_icon}
                    class="w-[120px] h-[60px]  align-middle"
                />
            )
        },

        {
            label: "生效时间",
            prop: "start_time",
            minWidth: 120,
            cellRenderer: ({ row }) => (
                <span>
                    {dayjs(row.start_time).format("YYYY-MM-DD HH:mm:ss")} -
                    {dayjs(row.end_time).format("YYYY-MM-DD HH:mm:ss")}
                </span>
            )
        },
        {
            label: "展示顺序",
            prop: "sort_pos",
            minWidth: 120
        },
        {
            label: "上架状态",
            prop: "status ",
            minWidth: 120,
            cellRenderer: ({ row }) => {
                const STATUS_ENUM = {
                    1: "上架",
                    0: "下架"
                };
                return <span>{STATUS_ENUM[row.status]}</span>;
            }
        },
        {
            label: "操作",
            fixed: "right",
            width: 220,
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
        let json = { ...form.value };
        if (form.value.time.length) {
            json.start_time = Date.parse(form.value.time[0]);
            json.end_time = Date.parse(form.value.time[1]);
        }
        if (Number(form.value.status) === 2) {
            json.status = null;
        }
        delete json.time;
        if (!json.banner_name) {
            delete json.banner_name;
        }
        try {
            const res = await getLaunchList(json);
            if (res.status === 200) {
                dataList.value = res.data.content;
                total.value = res.data.total;
                loading.value = false;
                pagination.total = res.data.total;
            }
        } catch (error) {
            loading.value = false;
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
    const dialogVisible = ref(false);
    const deleteBannerVisible = ref(false);
    const openDialog = () => {
        dialogVisible.value = true;
        launchItem.value = {};
    };
    const launchItem = ref({});

    const deleteBannerDialog = (row: any) => {
        deleteBannerVisible.value = true;
        launchItem.value = row;
    };
    //编辑
    const handleEdit = (row: any) => {
        dialogVisible.value = true;
        launchItem.value = row;
    };
    //上下架
    const handleStatus = async (row: Record<string, any>) => {
        try {
            await getAddLaunchStatus({
                id: row.id,
                status: row.status === 0 ? "ENABLE" : "DISABLE"
            });
            ElMessage.success(row.status === 0 ? "上架成功" : "下架成功");
        } finally {
            onSearch();
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
        onSearch,
        resetForm,
        handleStatus,
        pagination,
        dialogVisible,
        deleteBannerVisible,
        launchItem,
        deleteBannerDialog,
        handleEdit,
        openDialog,
        handleSizeChange,
        handleCurrentChange
    };
};
