import react from "@vitejs/plugin-react";
import {defineConfig} from "vite";

export default defineConfig({
    plugins: [react()],
    envPrefix: "VAR_",
    envDir: "./environment",
    server: {
        port: "3000",
    },
});
