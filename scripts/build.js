const webpack = require('webpack');
const webpackConfig = require('./../webpack.config');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const merge = require('webpack-merge');
const argv = process.argv.slice(2);
const path = require('path');

// Config files
const PATHS = require(path.join(__dirname, '/../webpack/paths'));
const BUILD_CONFIG = require(path.join(PATHS.webpack, '/build'));
let globalConfig = require(path.join(PATHS.webpack, '/global'));
globalConfig.HTML_WEBPACK_PLUGIN_CONFIG.devServer = false
const config = require(path.join(PATHS.webpack, '/config'));

// Variables
let compiler;

const launchCompiler = () => {
  return new Promise((resolve, reject) => {
    compiler.apply(new ProgressBarPlugin());
    compiler.run((err, stats) => {
      if (err) {
        reject(new Error(err));
      } else resolve();
    });
  });
}

Promise.resolve()
  .then((locales) => {
    globalConfig.HTML_WEBPACK_PLUGIN_CONFIG.window.isDev = false;

    if (process.env.NODE_ENV === 'production' && !process.env.APP_ENV) {
      globalConfig.HTML_WEBPACK_PLUGIN_CONFIG.window.conf = config.prod;
    } else if (process.env.NODE_ENV === 'production' && process.env.APP_ENV === 'preproduction') {
      globalConfig.HTML_WEBPACK_PLUGIN_CONFIG.window.conf = config.prep;
    }

    if (argv[0]) {
      globalConfig.HTML_WEBPACK_PLUGIN_CONFIG.publicPath = argv[0];
      globalConfig.HTML_WEBPACK_PLUGIN_CONFIG.window.path = argv[0];
    }

    compiler = webpack(
      merge(
        webpackConfig(globalConfig),
        BUILD_CONFIG(globalConfig)
      )
    );
  })
  .then(launchCompiler);
