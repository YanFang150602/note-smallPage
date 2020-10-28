const webpack = require('webpack');
const path = require('path');
// 打包优化
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const resolve = url => {
  return path.join(__dirname, url);
};
const port = process.env.PORT || 8080;

module.exports = {
  // outputDir: process.env.VUE_APP_BUILD_MODE === 'devops' ? 'dist' : 'market',
  assetsDir: 'static',
  chainWebpack: config => {
    config.plugins.delete('prefetch');
    config.plugins.delete('preload');
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
      .set('views', resolve('src/views'))
      .set('apis', resolve('src/apis'))
      .set('common', resolve('src/common'));
  },
  productionSourceMap: false, // process.env.NODE_ENV === 'production' ? '/market/' : '/'
  publicPath:
    process.env.VUE_APP_BUILD_MODE === 'devops'
      ? process.env.VUE_APP_BASE_URL
      : process.env.NODE_ENV === 'production'
      ? '/v1/sdwanmanofrontend001/'
      : '/',
  devServer: {
    //host: require('ip').address(),
    // localhost
    //host: '10.14.1.64',
    host: 'localhost',
    open: true,
    port,
    proxy: {
      /* '/controller': {
        target: 'http://oscargw.dev.cmiov.virtueit.net:81',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/controller': '/v0-snapshot/gateway/api/openapi/sdwan/controller'
        }
      }, */
      '/controller': {
        target: 'http://sdwanmano.dev.internal.virtueit.net:81',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/controller': '/v0-snapshot/sdwanservice/controller'
        }
      },
      '/v0-snapshot/gateway/api/openapi/sdwan': {
        target: 'http://sdwanmano.dev.internal.virtueit.net:81',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/v0-snapshot/gateway/api/openapi/sdwan': '/v0-snapshot/sdwanservice'
        }
      }
    }
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "~assets/css/common.scss";`
      }
    }
  },
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        // 在这儿添加下面两行
        'window.Quill': 'quill/dist/quill.js',
        // eslint-disable-next-line quote-props
        Quill: 'quill/dist/quill.js'
      })
      //   new BundleAnalyzerPlugin()
    ]
  },
  runtimeCompiler: true
};
