import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ─── Vite configuration for Vercel static deploy ──────────────────────────────
// base: '/' ensures asset paths resolve correctly on Vercel.
// React plugin provides JSX transform and Fast Refresh.
export default defineConfig({
  plugins: [react()],
  base: '/',
});
