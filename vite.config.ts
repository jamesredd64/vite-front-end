import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        exportType: "default",
      },
    }),
  ],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      onwarn(warning, warn) {
        // Skip certain warnings
        if (warning.code === 'EVAL' && 
            warning.id?.includes('@react-jvectormap/core')) {
          return;
        }
        warn(warning);
      }
    }
  },
  server: {
    port: 3000
  }
});
