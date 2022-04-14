import baseConfig from './base';
import { defineConfig } from 'vite';

export default defineConfig({
    ...baseConfig,
    base: '/MY-Kit',
    build: {
        outDir: 'docs',
    },
});
