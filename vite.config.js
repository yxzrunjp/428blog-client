import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { visualizer } from 'rollup-plugin-visualizer'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    visualizer({
      open:true,
      gzipSize:true,
    }),
    // ...
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  server: {
    hmr: true,//热更新
    port: 3002,//端口
    proxy: {
      '/api': {
        target: "http://localhost:8081",
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api',
        }
      }
    }
  },
  resolve: {
    // 配置别名
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes('node_modules')) {
            console.log(id);
          }
        },
        entryFileNames: 'static/[name].[hash].js',
        chunkFileNames: 'static/js/[name].[hash].js',
        assetFileNames: 'static/[ext]/[name].[hash].[ext]',
      }
    }
  }
})
