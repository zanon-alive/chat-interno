import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

// Configuração específica para build do widget
export default defineConfig({
  plugins: [vue()],
  
  // Define variáveis de ambiente para o browser
  define: {
    'process.env': JSON.stringify({}),
    'process.env.NODE_ENV': JSON.stringify('production'),
    '__VUE_OPTIONS_API__': true,
    '__VUE_PROD_DEVTOOLS__': false,
    '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': false
  },
  
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
        },
        
        // Inline dynamic imports for IIFE
        inlineDynamicImports: false
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
    },
    
    // Garantir compatibilidade com browsers
    target: 'es2015',
    
    // Não limpar o diretório (manter outros arquivos)
    emptyOutDir: false
  },
  
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
});

