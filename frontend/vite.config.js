import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSourceLocator } from "@metagptx/vite-plugin-source-locator";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    viteSourceLocator({
      prefix: "mgx",
    }),
    react(),
  ],
  server: {
    port: 3001,
    proxy: {
      // This rule proxies requests for your Node.js API (like /api/login)
      "/api": {
        target: "http://localhost:3002",
        changeOrigin: true,
      },
      // This NEW rule proxies requests for your Python OCR service
      "/ocr-api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        // This removes the '/ocr-api' prefix before sending to the Python server
        rewrite: (path) => path.replace(/^\/ocr-api/, ""),
      },
    },
  },
});
