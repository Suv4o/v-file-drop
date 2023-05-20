<script setup lang="ts">
import vFileDrop from "./components/v-file-drop.vue";
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

<template>
    <div class="container">
        <v-file-drop @change="onFileChange" multiple :accept="['image/png', 'image/jpeg']">
            <div class="file-upload" :style="{ backgroundImage: `url('${imageUrl}')` }">
                <template v-if="!imageUrl"> Drop your files here... </template>
            </div>
        </v-file-drop>
    </div>
</template>

<style scoped>
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
</style>
