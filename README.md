# `v-file-drop` is a simple Vue 3 drag and drop file uploader

This is a simple drag-and-drop file uploader for Vue 3. The purpose of this plugin is to give developers the ability to have flexibility with styling by applying their own HTML structure and styles.

## Install

```bash
npm install v-file-drop
```

## Use globally

### `main.ts`

```tsx
import VFileDropPlugin from "v-file-drop";
import "v-file-drop/styles.css";

const app = createApp(App);
app.use(VFileDropPlugin, { multiple: true, accept: ["image/jpeg", "image/png"] });
app.mount("#app");
```

### Template

```html
<template>
    <v-file-drop @change="onFileChange"> ADD YOUR OWN HTML </v-file-drop>
</template>
```

## Use locally

### Inside component Script Setup

```tsx
<script setup lang="ts">
    import {VFileDrop} from "./VFileDropPlugin";
</script>
```

### Template

```html
<template>
    <v-file-drop @change="onFileChange" multiple :accept="['image/png', 'image/jpeg']"> ADD YOUR OWN HTML </v-file-drop>
</template>
```

## Use with Nuxt 3

### `plugins/v-file.drop.ts`

To register the `v-file.drop` plugin so that it loads when the Vue application is created, we need to create a plugin inside the `plugins` folder.

```tsx
import VFileDropPlugin from "v-file-drop";
import "v-file-drop/styles.css";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(VFileDropPlugin, { multiple: true, accept: ["image/jpeg", "image/png"] });
});
```

### Template

If you want to use this plugin with `ssr: true` mode, you need to wrap the component with the `<ClientOnly>` tag.

```html
<template>
    <ClientOnly>
        <v-file-drop @change="onFileChange"> ADD YOUR OWN HTML </v-file-drop>
    </ClientOnly>
</template>
```

## Options

### Props

| Name     | Description                                                                                                                                                                                                | Type              | Default |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ------- |
| multiple | Allows multiple files to be selected.                                                                                                                                                                      | `Boolean`         | `false` |
| accept   | MIME types are allowed. You can pass all of the common MIME types listed https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types as an array or as a single string value. | `Array`, `String` | \*      |

### Events

| Name   | Description                                                                                                                                     | Type               | Default |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ------- |
| change | When a file is dropped or selected, this event returns a FileList if multiple files are selected, or a single File if multiple is set to false. | `FileList`, `File` | `File`  |

## Full Example

### `main.ts`

```tsx
import { createApp } from "vue";
import App from "./App.vue";
import VFileDropPlugin from "v-file-drop";
import "v-file-drop/styles.css";

const app = createApp(App);
app.use(VFileDropPlugin, { multiple: true, accept: ["image/jpeg", "image/png"] });
app.mount("#app");
```

### `components/example.vue`

Script Setup

```tsx
<script setup lang="ts">
import { ref } from "vue";

const imageUrl = ref("");
const reader = new FileReader();
reader.onload = (event) => {
    if (event.target) {
        imageUrl.value = event.target.result as string;
    }
};

function setUrlFromFiles(files: FileList | File) {
    // If is a single file, create a url from it
    if (files instanceof File) {
        reader.readAsDataURL(files);
    }
    // If is a FileList, create a url from the first file
    else {
        reader.readAsDataURL(files[0]);
    }
}

function onFileChange(files: FileList | File) {
    console.log(files);
    setUrlFromFiles(files);
}
</script>
```

Template

```html
<template>
    <div class="container">
        <v-file-drop @change="onFileChange" multiple :accept="['image/png', 'image/jpeg']">
            <div class="file-upload" :style="{ backgroundImage: `url('${imageUrl}')` }">
                <template v-if="!imageUrl">Drop your files here...</template>
            </div>
        </v-file-drop>
    </div>
</template>
```

Style

```css
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: lightblue;
}
.file-upload {
    max-width: 600px;
    max-height: 600px;
    width: 50vw;
    height: 50vw;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-color: lightcoral;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2.5rem;
    padding: 2rem;
    text-align: center;
    font-family: Georgia, "Times New Roman", Times, serif;
    color: white;
}
```
