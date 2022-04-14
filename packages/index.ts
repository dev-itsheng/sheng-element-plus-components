/* eslint-disable */

/**
 * !--------- FBI WARNING ----------!
 *
 * 根据 /packages 目录下的组件所生成的模块导出，请勿手动修改
 */
import { App, Plugin } from 'vue';

import STablePro from './s-table-pro';

const MYKitPlugin: Plugin = {
    install(app: App) {
        STablePro.install?.(app);
    },
};

export default MYKitPlugin;
