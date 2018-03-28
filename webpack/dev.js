const webpack = require('webpack');

module.exports = function (globalConfig) {
  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'style-loader',
            { loader: 'css-loader', options: { importLoaders: 1 } },
            'postcss-loader'
          ]
        }
      ]
    },
    entry: [
      'webpack-dev-server/client?http://0.0.0.0:8080',
      'webpack/hot/dev-server.js'
    ],
    devtool: 'source-map',
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin()
    ]
  };
}
