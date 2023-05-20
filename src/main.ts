import { createApp } from "vue";
import App from "./App.vue";
import VFileDropPlugin from "./VFileDropPlugin";

const app = createApp(App);
app.use(VFileDropPlugin, {});
app.mount("#app");
