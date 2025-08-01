import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig(({ mode }) => {
  // Explicitly set the root paths
  const clientRoot = path.resolve(__dirname, "client");
  const clientSrc = path.resolve(clientRoot, "src");

  return {
    plugins: [
      react(),
      runtimeErrorOverlay(),
      ...(mode === 'development' && process.env.REPL_ID
        ? [import("@replit/vite-plugin-cartographer").then(m => m.cartographer())]
        : [])
    ],
    resolve: {
      alias: {
        "@": clientSrc,
        "@components": path.resolve(clientSrc, "components"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets"),
      },
    },
    root: clientRoot,
    build: {
      outDir: path.resolve(__dirname, "dist/public"),
      emptyOutDir: true,
      sourcemap: mode === 'development',
      rollupOptions: {
        external: [
          // Add any external dependencies that shouldn't be bundled
        ]
      }
    },
    server: {
      proxy: {
        '/api': {
          target: process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : 'http://localhost:3000',
          changeOrigin: true,
          secure: false
        }
      },
      fs: {
        strict: true,
        allow: [
          clientRoot,
          path.resolve(__dirname, "shared"),
          path.resolve(__dirname, "attached_assets")
        ],
      },
    },
    define: {
      'process.env': {}
    }
  }
});