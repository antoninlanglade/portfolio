const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PATHS = require(path.join(__dirname, '/webpack/paths'));
const TARGET = process.env.npm_lifecycle_event;

process.env.BABEL_ENV = TARGET;

// Default configuration
module.exports = function (globalConfig) {
  return {
    entry: [
      path.join(PATHS.app, '/index.js')
    ],
    output: {
      path: PATHS.app,
      filename: '[name].js',
      chunkFilename: '[name].chunk.js'
    },
    module: {
      rules: [
        // Babel transpiler
        {
          test: /\.(js|jsx)$/,
          loaders: 'babel-loader',
          options: {
            cacheDirectory: true
          },
          include: PATHS.app
        },
        // File Loader
        {
          test: /\.(png|jpg|jpeg|gif|ico)$/,
          loader: 'file-loader',
          options: {
            limit: 1
          }
        },

        {
          test: /\.handlebars$/,
          loader: 'handlebars-loader'
        },
        {
          test: /\.json$/,
          use: 'json-loader'
        }
      ]
    },
    resolve: {
      extensions: ['.js'],
      modules: ['node_modules', PATHS.app]
    },
    plugins: [
      new HtmlWebpackPlugin(globalConfig.HTML_WEBPACK_PLUGIN_CONFIG)
    ]
  };
}
