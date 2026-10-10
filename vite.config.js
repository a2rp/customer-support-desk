import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    base: "/customer-support-desk/",
    build: {
        sourcemap: false,
    },
    plugins: [react()],
});
