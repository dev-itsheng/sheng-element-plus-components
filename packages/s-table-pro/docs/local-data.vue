<template lang="pug">
s-table-pro(type="array", source="local", :columns="columns", :local-data="data")
    template(#operation="scope")
        button(@click="log(scope)") 按钮
</template>

<script setup lang="tsx">
const columns = [
    ['编号', 'id', { help: <span style="color: red">这是一个编号</span> }],
    ['姓名', 'name', { formatter(row: any, column: any, val: any) { return '姓名：' + val } }],
    ['操作', 'operation']
];

const data = [
    ...Array.from({ length: 15 }).map((_, index) => ({ id: index + 1, name: '小明' })),
    ...Array.from({ length: 15 }).map((_, index) => ({ id: index + 15, name: '小升' })),
]

const log = (scope: any) => {
    console.log(scope);
};
</script>
