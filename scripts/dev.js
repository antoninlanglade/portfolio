const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const WebpackDevServer = require('webpack-dev-server');
const PATHS = require(path.join(__dirname, '/../webpack/paths'));

// Configs
const webpackConfig = require('./../webpack.config');
let globalConfig = require(PATHS.webpack + '/global');
globalConfig.HTML_WEBPACK_PLUGIN_CONFIG.devServer = true
const DEV_CONFIG = require(PATHS.webpack + '/dev');
const config = require(path.join(PATHS.webpack, '/config'));

let compiler, server;

const launchServer = () => {
  return new Promise((resolve, reject) => {
    server = new WebpackDevServer(compiler, {
      contentBase: PATHS.assets,
      historyApiFallback: true,
      compress: true,
      clientLogLevel: 'info',
      hot: true,
      inline: true,
      stats: { colors: true }
    });

    server.listen(8080, '0.0.0.0', resolve);
  });
}
Promise.resolve()
  .then(() => {
    globalConfig.HTML_WEBPACK_PLUGIN_CONFIG.window.isDev = true;
    globalConfig.HTML_WEBPACK_PLUGIN_CONFIG.window.conf = config.dev;

    compiler = webpack(merge(
      webpackConfig(globalConfig),
      DEV_CONFIG(globalConfig)
    ));
  })
  .then(launchServer)
