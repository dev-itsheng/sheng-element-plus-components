import { App } from 'vue';
import STablePro from './src/index.vue';
STablePro.install = (app: App) => {
    app.component('STablePro', STablePro);
}
export default STablePro;
