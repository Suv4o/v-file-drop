import type { App } from "vue";
import { VFileDrop } from "./components";
import { MimeTypes } from "./components/v-file-drop.vue";

export default {
    install: (app: App, options: { multiple?: boolean; accept?: MimeTypes | MimeTypes[] }) => {
        app.component("VFileDrop", VFileDrop);
        app.provide("VFileDropOptions", options);
    },
};

export { VFileDrop };
