require('./check-versions')()
var config = require('../config/index')
if (!process.env.NODE_ENV) process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var opn = require('opn')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = process.env.NODE_ENV === 'testing'
  ? require('./webpack.prod.conf')
  : require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()

/** begin **/

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('cookie-session');
const bodyParser = require('body-parser');
const timeout = require('connect-timeout');
const appConfig = require('../sys-config');
const log4js = require('log4js');

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session(appConfig.cookieOptions))
app.use(express.static(path.join(__dirname, '../public')));
// app.use(timeout('15s'));

log4js.configure({
    appenders: [
        {type: 'console'}
        /*{type: 'console', category: 'web'},
         {type: 'console', category: 'api'},
         {type: 'console', category: 'health'}*/
    ],
    levels: { log_file: 'ALL', console: 'ALL', log_date: 'ALL' }
})

require('../app/bootstrap/BaseInit');
require('../app/bootstrap/registerHelpers');
app.use(require('../middleware/session-info'));
app.use(require('../middleware/json-result'));
app.use(require('../middleware/admin-session'));

// app.use(['/mgr/api', 'login'], require('../app/mgr-api'));
app.use(require('../app/web/router'));
app.use(require('../app/mgr/router'));

//app.use(require('./dispatch'));
// require('../dispatch')(app);

/** end **/

// var compiler = webpack(webpackConfig)

/*var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true,
    chunks: false
  }
})*/

/*var hotMiddleware = require('webpack-hot-middleware')(compiler)
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})*/

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
// app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
// app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  var uri = 'http://localhost:' + port
  console.log('Listening at ' + uri + '\n')

  // when env is testing, don't need open it
  if (process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
})
