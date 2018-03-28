const PATHS = require('./paths');
const webpack = require('webpack');
// Clean folders
const CleanPlugin = require('clean-webpack-plugin');
// Copy files
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = function (globalConfig) {
  return {
    output: {
      path: PATHS.build,
      filename: '[name].js'
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              { loader: 'css-loader', options: { importLoaders: 1 } },
              'postcss-loader'
            ]
          })
        }
      ]
    },
    plugins: [
      new ExtractTextPlugin('[name].css'),
      // Clean before build
      new CleanPlugin(['build'], {
        root: PATHS.root
      }),

      // Copy static files
      new CopyWebpackPlugin([
        { from: PATHS.assets, to: PATHS.build }
      ]),

      // NODE Production for size optimization
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        }
      }),

      // Uglify JS
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ]}
}
