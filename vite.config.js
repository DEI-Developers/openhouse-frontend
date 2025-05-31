/* eslint-disable no-undef */
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd());

  return {
    base: env.VITE_BASE_PATH ?? '/',
    server: {
      allowedHosts: true,
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@assets': path.resolve(__dirname, 'src/assets'),
        '@context': path.resolve(__dirname, 'src/context'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@config': path.resolve(__dirname, 'src/config'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        '@pages': path.resolve(__dirname, 'src/pages'),
        '@services': path.resolve(__dirname, 'src/services'),
        '@utils': path.resolve(__dirname, 'src/utils'),
      },
    },
  };
});
