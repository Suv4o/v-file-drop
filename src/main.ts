import { createApp } from "vue";
import App from "./App.vue";
import VFileDropPlugin from "./VFileDropPlugin";

const app = createApp(App);
app.use(VFileDropPlugin, { multiple: true, accept: ["image/jpeg", "image/png"] });
app.mount("#app");
