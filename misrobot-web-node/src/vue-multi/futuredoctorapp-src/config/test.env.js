var merge = require('webpack-merge')
var devEnv = require('../../config/dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"'
})

