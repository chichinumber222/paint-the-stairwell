import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  build: {
    manifest: true,
  },
  plugins: [
    VitePWA({
      includeAssets: ["apple-touch-icon.png"],
      strategies: "injectManifest",
      srcDir: "src",
      filename: "service-worker.ts",
      injectManifest: {
        globPatterns: ["assets/*.{js,css,png,jpg,svg}"],
      },
      manifest: false,
    }),
  ],
});
