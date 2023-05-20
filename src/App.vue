<script setup lang="ts">
import vFileDrop from "./components/v-file-drop.vue";

function onFileChange(files: FileList | File) {
    console.log(files);
}
</script>

<template>
    <div>
        <v-file-drop @change="onFileChange" multiple :accept="['image/png', 'image/jpeg']">
            <div class="file-upload"></div>
        </v-file-drop>
    </div>
</template>

<style scoped>
.file-upload {
    width: 500px;
    height: 500px;
    background-color: blue;
}
</style>
