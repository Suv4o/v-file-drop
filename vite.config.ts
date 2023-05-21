import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import typescript2 from "rollup-plugin-typescript2";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        dts({
            insertTypesEntry: true,
        }),
        typescript2({
            check: false,
            include: ["src/components/**/*.vue"],
            tsconfigOverride: {
                compilerOptions: {
                    outDir: "dist",
                    sourceMap: true,
                    declaration: true,
                    declarationMap: true,
                },
            },
            exclude: ["vite.config.ts"],
        }),
    ],
    build: {
        cssCodeSplit: false,
        lib: {
            entry: "./src/VFileDropPlugin.ts",
            formats: ["es", "cjs"],
            name: "VFileDropPlugin",
            fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
        },
        rollupOptions: {
            external: ["vue"],
            output: {
                exports: "named",
                globals: {
                    vue: "Vue",
                },
            },
        },
    },
    server: {
        port: 3000,
    },
});
