const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    proxy: {
      "/api": {
        target:
          "https://www.fastmock.site/mock/bf1fcb3c2e2945669c2c8d0ecb8009b8",
        changeOrigin: true,
      },
    },
  },
});
