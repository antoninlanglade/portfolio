var webpack = require('webpack');

module.exports = {
    entry: {
        "main": "./src/main.js"
    },
    output: {
        filename: "[name].js",
        publicPath: "/js/"
    },
    resolve: {
        alias: {
            // Alias
            'config': __dirname+'/src/config',
            'components': __dirname+'/src/components/',
            'desktop': __dirname+'/src/components/desktop',
            'mobile': __dirname+'/src/components/mobile',
            'actions': __dirname+'/src/actions/',
            'stores': __dirname+'/src/stores/',

            // Libs
            'dan': __dirname+'/src/bundles/dan',
            'tools': __dirname+'/src/bundles/tools',
            'math': __dirname+'/src/bundles/math',
            'events': __dirname+'/node_modules/events/events.js',
            'async': __dirname+'/node_modules/async/lib/async.js',
            'jquery': __dirname+'/node_modules/jquery/dist/jquery.min.js',
            '_': __dirname+'/node_modules/lodash/index.js',
            'react': __dirname+'/node_modules/react/dist/react.min.js',
            'react-dom': __dirname+'/node_modules/react-dom/dist/react-dom.min.js',
            'page': __dirname+'/node_modules/page/page.js',
            'gsap': __dirname+'/node_modules/gsap/src/uncompressed/TweenMax.js',
            'webfont': __dirname+'/node_modules/webfontloader/webfontloader.js',
            'alt/utils': __dirname+'/node_modules/alt/utils/',
            'alt': __dirname+'/node_modules/alt/dist/alt.js',
            'signals' : __dirname+'/node_modules/signals/dist/signals.js',
            'rebound' : __dirname+'/node_modules/rebound/rebound.min.js',
            'wheel-inertia' : __dirname+'/node_modules/wheel-inertia/index.js'
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        })
    ],
    module: {
        loaders: [
            { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel', query: { stage: 1 } },
            { test: /\.json$/, loader: "json" },
            { test: /\.scss/, loader: "style!css!sass!postcss" },
            { test: /\.css$/, loader: "style!css!postcss" }
        ],
        noParse: [
            __dirname+'/node_modules/react/dist/react.min.js',
            __dirname+'/node_modules/page/page.js'
        ]
    },
    postcss: [
        require('autoprefixer')
    ],
    devtool: ''
};