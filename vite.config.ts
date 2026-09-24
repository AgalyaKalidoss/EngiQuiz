import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          subjects: path.resolve(__dirname, 'subjects.html'),
          practice: path.resolve(__dirname, 'practice.html'),
          quiz: path.resolve(__dirname, 'quiz.html'),
          result: path.resolve(__dirname, 'result.html'),
          progress: path.resolve(__dirname, 'progress.html'),
          history: path.resolve(__dirname, 'history.html'),
          bookmarks: path.resolve(__dirname, 'bookmarks.html'),
          login: path.resolve(__dirname, 'login.html'),
        },
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
