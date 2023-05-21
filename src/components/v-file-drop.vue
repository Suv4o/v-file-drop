<script setup lang="ts">
import { computed, ref, inject, Ref } from "vue";
import { MimeTypes } from "./index";

export interface Props {
    accept?: MimeTypes | MimeTypes[];
    multiple?: boolean;
}

const injectedOptions = inject("VFileDropOptions", { accept: undefined, multiple: undefined }) as Props;
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
