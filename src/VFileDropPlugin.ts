import type { App } from "vue";
import { VFileDrop } from "./components";
import { MimeTypes } from "./components/index";

export default {
    install: (app: App, options: { multiple?: boolean; accept?: MimeTypes | MimeTypes[] }) => {
        app.component("VFileDrop", VFileDrop);
        app.provide("VFileDropOptions", options);
    },
};

export { VFileDrop };
