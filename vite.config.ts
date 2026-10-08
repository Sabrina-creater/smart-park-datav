import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

// 部署到 GitHub Pages 时 base 为仓库名；本地或自定义域名可通过 VITE_BASE=/ 覆盖
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE ?? "/smart-park-datav/",
  resolve: {
    alias: {
      "@": resolve("src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rolldownOptions: {
      output: {
        // 把 three / echarts 拆成独立 chunk，便于浏览器缓存
        advancedChunks: {
          groups: [
            { name: "three", test: /node_modules[\\/](three|@react-three)[\\/]/ },
            { name: "echarts", test: /node_modules[\\/](echarts|zrender)[\\/]/ },
          ],
        },
      },
    },
  },
});
