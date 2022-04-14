import baseConfig from './base';
import { defineConfig, mergeConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default mergeConfig(baseConfig, defineConfig({
    build: {
        outDir: 'dist',
        lib: {
            entry: resolve(__dirname, '../packages/index.ts'),
            name: 'ShengElementPlusComponents',
            fileName: (format) => `index.${format}.js`,
        },
        rollupOptions: {
            // 确保外部化处理那些你不想打包进库的依赖
            external: ['vue', 'element-plus', '@sheng/vnode-render', '@element-plus/icons-vue'],
            output: {
                // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
                globals: {
                    vue: 'Vue',
                    'element-plus': 'ElementPlus'
                }
            }
        },
    },
    plugins: [
        dts(),
    ]
}));

// export default defineConfig({
//     ...baseConfig,
//     build: {
//         outDir: 'dist',
//         lib: {
//             entry: resolve(__dirname, '../packages/index.ts'),
//             name: 'ShengElementPlusComponents',
//             fileName: (format) => `index.${format}.js`,
//         },
//         rollupOptions: {
//             // 确保外部化处理那些你不想打包进库的依赖
//             external: ['vue', 'element-plus'],
//             output: {
//                 // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
//                 globals: {
//                     vue: 'Vue',
//                     'element-plus': 'ElementPlus'
//                 }
//             }
//         }
//     },
//     plugins: [
//         ...baseConfig.plugins,
//         dts(),
//     ]
// });
