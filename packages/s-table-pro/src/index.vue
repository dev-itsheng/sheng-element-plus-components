<template lang="pug">
el-table(border, :data="data" v-bind="$attrs")
    el-table-column(v-for="column in transformedColumns" :key="column.prop" v-bind="column")
        template(#header="scope")
            s-vnode(:content="column.label")
            el-tooltip(v-if="column.help")
                template(#content)
                    s-vnode(:content="column.help")
                el-icon(style="margin-left: 5px; vertical-align: text-top")
                    info-filled
        template(#default="scope")
            slot(:name="column.prop" v-bind="scope")
                s-vnode(:content="getCellValue(scope, column)")
el-pagination(
    style="margin-top: 20px",
    v-if="transformedPagination",
    :layout="transformedPagination.layout",
    :background="transformedPagination.background",
    :page-size="currentPageSize",
    :page-sizes="transformedPagination.pageSizes",
    :total="total",
    :current-page="currentPage",
    @current-change="handleCurrentChange",
    @size-change="handleSizeChange"
)
</template>

<script lang="tsx" setup>
import { ref, computed, watch } from 'vue';
import { get, isPlainObject, merge } from 'lodash-es';
import { InfoFilled } from '@element-plus/icons-vue';
import { ElTable, ElTableColumn, ElIcon, ElTooltip, ElPagination } from 'element-plus';
import SVnode from '@sheng/vnode-render';

const props = withDefaults(
    defineProps<{
        source?: 'local' | 'remote',
        type?: 'array' | 'object',
        localData?: any[],
        columns: any[]
        buildParams?: (params: any, tableParams: { paging: { offset: number, limit: number } }) => any
        responseProcessor?: (res: any) => { list: any[], total: number }
        ajax?: {
            url: string,
            type: 'post' | 'get' | Function,
            params: any,
        },
        pagination?: boolean | {
            /** 分页布局 */
            layout: string,
            /** 是否显示背景 */
            background: boolean,
            /** 每页显示条数 */
            pageSize: number,
            /** 每页显示条数下拉列表 */
            pageSizes: number[]
        }
    }>(),
    {
        source: 'remote',
        type: 'object',
        buildParams: (params, tableParams) => { return { ...params, ...tableParams } },
        responseProcessor: res => { return res },
        pagination: true
    }
);

enum TABLE_STATUS { LOADING, DONE, ERROR }

// 将数组形式的 columns 转成对象形式
const transformedColumns = computed(() => (
    props.type === 'array'
        ? props.columns.map(([label, prop, ...args]) => ({ label, prop, ...merge({}, ...args) }))
        : props.columns
));

// 用于存放远程数据
const remoteData = ref([]);

// 最终 el-table 使用的 data
const data = computed(() => (
    props.source === 'local'
        ? props.pagination
            ? props.localData!.slice(currentPageSize.value * (currentPage.value - 1), currentPageSize.value * currentPage.value)
            : props.localData
        : remoteData.value
));

// 远端数据的
const remoteTotal = ref(0);

const total = computed(() => props.source === 'local' ? props.localData!.length : remoteTotal.value);

// 当前页
const currentPage = ref(1);

// 当前每页显示条数
const currentPageSize = ref(0);

// 表格状态，初始为就绪，可在加载中和加载错误之间切换
const status = ref<TABLE_STATUS>(TABLE_STATUS.DONE);

// 转换分页数据
const transformedPagination = computed(() => {
    const defaultPagination = {
        layout: 'sizes, total, ->, prev, pager, next, jumper',
        background: true,
        pageSize: 20,
        pageSizes: [10, 20, 50, 100]
    };

    if (props.pagination === true) {
        return defaultPagination;
    } else if (isPlainObject(props.pagination)) {
        return { ...defaultPagination, ...props.pagination }
    } else {
        return false as never;
    }
});

const transformedAjaxMethod = computed(() => {
    if (props.source === 'remote') {
        if (typeof props.ajax!.type === 'function') {
            return props.ajax!.type;
        }

        return (url: string, params = {}) => fetch(url, {
            body: JSON.stringify(params),
            method: props.ajax!.type as 'post' | 'get',
            credentials: 'include'
        }).then(x => x.json());
    }

    return null as never;
})

// 当分页数据变化时，更新当前页大小
watch(transformedPagination, (val) => {
    if (val) {
        currentPageSize.value = val.pageSize;
    }
}, { immediate: true });

// 获取远端数据
const fetchData = async () => {
    status.value = TABLE_STATUS.LOADING;
    try {
        const { pageSize } = transformedPagination.value;

        const res = props.responseProcessor(
            await transformedAjaxMethod.value(
                props.ajax!.url,
                props.buildParams(
                    props.ajax!.params || {},
                    { paging: { limit: props.pagination ? pageSize : total.value, offset: (currentPage.value - 1) * pageSize } }
                )
            )
        );
        remoteData.value = res.list;
        remoteTotal.value = res.total;
        status.value = TABLE_STATUS.DONE;
    } catch (e) {
        status.value = TABLE_STATUS.ERROR;
        throw e;
    }
};

if (props.source === 'remote') {
    fetchData();
}

// 获取某个单元格的数据
const getCellValue = (scope: any, column: any) => {
    const val = get(scope.row, column.prop);
    return column.formatter?.(scope.row, column, val, scope.$index) || val || '--';
};

// 处理翻页
const handleCurrentChange = (page: number) => {
    currentPage.value = page;
};

// 处理
const handleSizeChange = (pageSize: number) => {
    currentPageSize.value = pageSize;
    currentPage.value = 1;
};
</script>
