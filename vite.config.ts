import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: 'https://github.com/Aravind526/Neu-Social-Networking-Portal.git',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
