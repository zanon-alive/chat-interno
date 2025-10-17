import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

// Configuração específica para build do widget
export default defineConfig({
  plugins: [vue()],
  
  build: {
    lib: {
      entry: resolve(__dirname, 'src/widget/index.js'),
      name: 'ChatWidget',
      fileName: (format) => `chat-widget.${format}.js`,
      formats: ['iife', 'umd']
    },
    
    rollupOptions: {
      // Externalize deps that shouldn't be bundled
      external: [],
      
      output: {
        // Globals for UMD build
        globals: {},
        
        // Asset file names
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') {
            return 'chat-widget.css';
          }
          return assetInfo.name;
        }
      }
    },
    
    // Output directory
    outDir: 'dist/widget',
    
    // Generate source maps
    sourcemap: true,
    
    // Minify
    minify: 'terser',
    
    terserOptions: {
      compress: {
        drop_console: false
      }
    }
  },
  
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
});

