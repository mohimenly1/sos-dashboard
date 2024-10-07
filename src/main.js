import { createApp } from "vue";
import App from "./App.vue";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import store from "./store";
import router from "./router";
import "./assets/css/nucleo-icons.css";
import 'leaflet/dist/leaflet.css';
import "./assets/css/nucleo-svg.css";
import MaterialDashboard from "./material-dashboard";

const appInstance = createApp(App);
appInstance.use(store);
appInstance.use(router);
appInstance.use(MaterialDashboard);
appInstance.use(ElementPlus);
appInstance.mount("#app");
