import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import Pages from "vite-plugin-pages";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  root: "./src",
  plugins: [
    react(),
    Pages({
      pagesDir: [{ dir: "pages", baseRoute: "" }],
      extensions: ["tsx"],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    proxy: {
      "/api/v1": {
        target: "http://localhost:9001/",
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api\/v1/, ""),
      },
    },
    port: 9000,
    host: true,
  },
  define: {
    ...(process.env.NODE_ENV === 'development' ? { global: "window" } : {}),
  },
  build: {
    outDir: "../.local/vite/dist",
    emptyOutDir: true,
    assetsDir: "assets",
    sourcemap: true,
    manifest: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
        },
      },
    },
  },
})
