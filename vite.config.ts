import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import typescript from "rollup-plugin-typescript2";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        typescript({
            check: false,
            include: ["src/components/*.vue"],
            tsconfigOverride: {
                compilerOptions: {
                    sourceMap: true,
                    declaration: true,
                    declarationMap: true,
                },
                exclude: ["vite.config.ts", "main.ts"],
            },
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
