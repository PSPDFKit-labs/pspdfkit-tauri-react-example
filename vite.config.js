/** @type {import('vite').UserConfig} */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import copy from "rollup-plugin-copy";

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    react(),
    copy({
      targets: [
        {
          src: "node_modules/pspdfkit/dist/pspdfkit-lib",
          dest: "public/",
        },
      ],
      hook: "buildStart",
    }),
  ],
  build: {
    outDir: "build",
  },
});
