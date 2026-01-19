import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["img/pwa-192x192.png", "img/pwa-512x512.png"],
      manifest: {
        name: "My React PWA",
        short_name: "ReactPWA",
        description: "A Progressive Web App built with Vite + React",
        theme_color: "#FF3366",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "img/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "img/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        // Increase default max cache size to 5MB (or more if needed)
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
    }),
  ],
});
