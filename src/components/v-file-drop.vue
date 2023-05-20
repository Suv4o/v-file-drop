<script setup lang="ts">
import { computed, ref, inject, Ref } from "vue";

export type MimeTypes =
    | "audio/aac"
    | "application/x-abiword"
    | "application/x-freearc"
    | "image/avif"
    | "video/x-msvideo"
    | "application/vnd.amazon.ebook"
    | "application/octet-stream"
    | "image/bmp"
    | "application/x-bzip"
    | "application/x-bzip2"
    | "application/x-cdf"
    | "application/x-csh"
    | "text/css"
    | "text/csv"
    | "application/msword"
    | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    | "application/vnd.ms-fontobject"
    | "application/epub+zip"
    | "application/gzip"
    | "image/gif"
    | "text/html"
    | "image/vnd.microsoft.icon"
    | "text/calendar"
    | "application/java-archive"
    | "image/jpeg"
    | "text/javascript"
    | "application/json"
    | "application/ld+json"
    | "audio/midi"
    | "audio/x-midi"
    | "text/javascript"
    | "audio/mpeg"
    | "video/mp4"
    | "video/mpeg"
    | "application/vnd.apple.installer+xml"
    | "application/vnd.oasis.opendocument.presentation"
    | "application/vnd.oasis.opendocument.spreadsheet"
    | "application/vnd.oasis.opendocument.text"
    | "audio/ogg"
    | "video/ogg"
    | "application/ogg"
    | "audio/opus"
    | "font/otf"
    | "image/png"
    | "application/pdf"
    | "application/x-httpd-php"
    | "application/vnd.ms-powerpoint"
    | "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    | "application/vnd.rar"
    | "application/rtf"
    | "application/x-sh"
    | "image/svg+xml"
    | "application/x-tar"
    | "image/tiff"
    | "video/mp2t"
    | "font/ttf"
    | "text/plain"
    | "application/vnd.visio"
    | "audio/wav"
    | "audio/webm"
    | "video/webm"
    | "image/webp"
    | "font/woff"
    | "font/woff2"
    | "application/xhtml+xml"
    | "application/vnd.ms-excel"
    | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    | "application/xml"
    | "text/xml"
    | "application/atom+xml"
    | "application/xml"
    | "application/vnd.mozilla.xul+xml"
    | "video/3gpp"
    | "audio/3gpp"
    | "video/3gpp2"
    | "audio/3gpp2"
    | "application/x-7z-compressed";

export interface Props {
    accept?: MimeTypes | MimeTypes[];
    multiple?: boolean;
}

const injectedOptions = inject("VFileDropOptions") as Props;
const { accept: injectedAccept, multiple: injectedMultiple } = injectedOptions;

const props = withDefaults(defineProps<Props>(), {
    accept: () => [],
    multiple: false,
});

const emit = defineEmits<{
    (event: "change", files: FileList | File): void;
}>();

const accept = computed(() => {
    if (injectedAccept) {
        return injectedAccept;
    }
    return props.accept;
});

const multiple = computed(() => {
    if (injectedMultiple) {
        return injectedMultiple;
    }
    return props.multiple;
});

const files = ref() as Ref<FileList | File[]>;

const returnFiles = computed(() => {
    if (multiple.value) {
        return files.value as FileList;
    }
    return files.value[0] as File;
});

function emitChange() {
    emit("change", returnFiles.value);
}

const acceptInputMimeTypes = computed(() => {
    if (!accept.value.length) {
        return "";
    }
    if (typeof accept.value === "string") {
        return accept.value;
    }
    return accept.value.join(",");
});

function checkIfTypeMimeIsAllowedOnDrop(file: File) {
    const fileType = <MimeTypes>file.type;
    if (!accept.value.length) {
        return true;
    }
    if (typeof accept.value === "string") {
        return fileType === accept.value;
    }
    return accept.value.includes(fileType);
}

function onFileChange(event: Event) {
    const eventTarget = event.target as HTMLInputElement;
    if (!eventTarget.files) {
        return;
    }
    files.value = eventTarget.files;
    emitChange();
}

function onFileDrop(event: DragEvent) {
    event.preventDefault();
    if (!event.dataTransfer) {
        return;
    }

    files.value = [];

    if (!multiple.value && (event.dataTransfer?.items?.length > 1 || event?.dataTransfer?.files?.length > 1)) {
        console.warn(
            "Only one file is allowed. Please add the 'multiple' prop on the component to allow multiple files."
        );
    }

    if (event.dataTransfer.items) {
        for (const item of [...event.dataTransfer.items]) {
            if (item.kind === "file") {
                const file = item.getAsFile();
                if (file && !checkIfTypeMimeIsAllowedOnDrop(file)) {
                    console.error(
                        `The file ${file.name} is not allowed. Please add the '${file.type}' mime type to the 'accept' prop on the component.`
                    );
                    return;
                }
                if (file) {
                    files.value.push(file);
                }
            }
        }
    } else {
        for (const file of [...event.dataTransfer.files]) {
            if (file && !checkIfTypeMimeIsAllowedOnDrop(file)) {
                console.error(
                    `The file ${file.name} is not allowed. Please add the '${file.type}' mime type to the 'accept' prop on the component.`
                );
                return;
            }
            if (file) {
                files.value.push(file);
            }
        }
    }
    emitChange();
}

function onDragover(event: DragEvent) {
    event.preventDefault();
}
</script>

<template>
    <div class="file-upload__container">
        <input
            class="file-upload__input"
            @change="onFileChange"
            type="file"
            id="upload-file"
            :accept="acceptInputMimeTypes"
            :multiple="multiple"
        />
        <div>
            <slot></slot>
        </div>
        <label @drop="onFileDrop" @dragover="onDragover" class="file-upload__label" for="upload-file"></label>
    </div>
</template>

<style scoped>
.file-upload__container {
    position: relative;
    width: max-content;
    height: max-content;
}
.file-upload__label {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
}

.file-upload__input {
    display: none;
}
</style>
