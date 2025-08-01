import { defineConfig, loadEnv } from '@rsbuild/core';
import { pluginLess } from '@rsbuild/plugin-less';
import { pluginVue } from '@rsbuild/plugin-vue';
import path from 'path';

const current_dir = process.cwd();

const { publicVars } = loadEnv();
console.log(publicVars);

export default defineConfig({
  plugins: [
    pluginVue(),
    pluginLess({
      lessLoaderOptions: {
        lessOptions: {
          javascriptEnabled: true,
          modifyVars: {
            hack: `true; @import "${path.resolve('./src/assets/style/modify-vars.less')}";`,
          },
        },
      },
    }),
  ],
  html: { template: './public/index.html', title: '搜索机器人' },
  server: {
    port: 3100,
  },
  environments: {
    web: {
      source: {
        define: publicVars,
        entry: { index: './src/main.ts' },
      },
      resolve: {
        alias: {
          '@': path.resolve(current_dir, './src'),
          '~': path.resolve(current_dir, './'),
        },
      },
    },
  },
  output: {
    distPath: { root: 'chrome/side_panel' },
    assetPrefix: './',
  },
});
