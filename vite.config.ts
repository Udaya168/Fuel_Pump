import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    nitro(),
    tanstackStart(),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    port: 5174,
  }
});
