import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import staticCopy from './vite-plugin-static-copy.js'; // 引入自定义插件

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    staticCopy({
      src: 'node_modules/pdfjs-dist/cmaps/*', // 源文件路径
      dest: 'cmaps' // 输出目录
    }),
  ],
  // assetsInclude:['pdfjs-dist/cmaps/*'],
  // worker:{
  //   format: 'es'
  // },
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/main.js'),
      name: 'PDFViewer',
      // the proper extensions will be added
      fileName: 'pdf-viewer',
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
