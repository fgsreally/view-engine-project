import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vitest/config";
export default defineConfig({
  plugins: [vue() as any],
  test: {
    environment: "happy-dom", // 或 'jsdom', 'node'
    // include: ["**/test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
  },
});
