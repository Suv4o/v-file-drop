<script setup lang="ts">
import vFileDrop from "./components/v-file-drop.vue";
</script>

<template>
    <div>
        <v-file-drop multiple>
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
