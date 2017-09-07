// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
console.log(__dirname)
//__dirname是当前.js文件的绝对路径的文件夹部分
console.log(path.resolve(__dirname, '../../../pages/scmp/scmp_cli.html'))
console.log(path.resolve(__dirname, '../../../static/vue_pc'))
module.exports = {
  build: {
<<<<<<< HEAD:misrobot-web-node/src/vue-multi/project-dms/baseconfig/index.js
    env: require('../../config/prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
=======
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../../../pages/scmp/scmp-cli.html'),
    assetsRoot: path.resolve(__dirname, '../../../static/vue_pc'),
    assetsSubDirectory: 'assets',
    assetsPublicPath: '/static/vue_pc/',
>>>>>>> remotes/origin/feature/technique:misrobot-web/src/main/webapp/vue-src/vue_pc/config/index.js
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('../../config/dev.env'),
    port: 8080,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {},
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
