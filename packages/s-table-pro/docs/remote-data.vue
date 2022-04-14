<template lang="pug">
s-table-pro(type="array", :columns="columns2" :ajax="ajax", :responseProcessor="responseProcessor" :pagination="false")
</template>

<script lang="ts" setup>
// 接口返回值的类型
interface Res {
    cityid: string;
    city: string;
    update_time: string;
    data: {
        date: string;
        wea: string;
        wea_img: string;
        tem_day: string;
        tem_night: string;
        win: string;
        win_speed: string;
    }[];
}

const columns2 = [
    ['日期', 'date'],
    ['天气', 'wea'],
    ['温度', '', { formatter(row: Res['data'][number]) { return `${row.tem_night}°C ~ ${row.tem_day}°C` } }],
    ['风向', 'win'],
    ['风力', 'win_speed']
];

const ajax = {
    url: 'https://www.yiketianqi.com/free/week?unescape=1&appid=85368969&appsecret=yl3J667F',
    type: (url: string) => fetch(url).then(x => x.json())
}

const responseProcessor = (res: Res) => {
    return {
        list: res.data,
        total: res.data.length
    }
}
</script>
