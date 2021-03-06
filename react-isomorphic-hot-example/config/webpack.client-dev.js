const webpack = require('webpack');
const path = require('path');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const OccurrenceOrderPlugin = require('webpack/lib/optimize/OccurrenceOrderPlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const babelrc = require('../babel.config.js').dev_client;

const ROOT_PATH = process.cwd();
// process.traceDeprecation = true;

const config = {
    target: 'web',
	devtool: 'cheap-module-eval-source-map',
    context: ROOT_PATH + '/src',
    entry: {
        vendor: [
            'react-hot-loader/patch',
            'react',
			'react-dom'
        ],
        home: './client/home',
        account: './client/account'
    },

    output: {
        path: ROOT_PATH + '/static/dist',
        filename: '[name].js',
        chunkFilename: '[name].min.js',
        publicPath: 'http://127.0.0.1:8080/dist/'
    },

    resolve: {
      modules: ['node_modules'],
      extensions: [
        '.json', '.js', '.jsx',
      ],
    },

    resolveLoader: {
      moduleExtensions: ['-loader']
    },

    module: {
        rules: [
            {
                test: /\.(png|jpg|jpeg|gif|webp)$/i,
                loader: 'url?limit=10000'
            },
            {
              test: /\.css$/,
              use: ExtractTextPlugin.extract({
                fallback: 'style',
                use: [
                  {loader: 'css', options: {importLoaders: 1, sourceMap: true}},
                  {
                    loader: 'postcss',
                    options: {config: {path: path.join(__dirname, 'postcss.antd.js')}},
                  }
                ],
              }),
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel',
                options: babelrc
            }
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            __CLIENT__: true,
            __SERVER__: false,
            __PRODUCTION__: false,
            __DEV__: true,
            'process.env': {
                NODE_ENV: '"development"'
            }
        }),

        new CommonsChunkPlugin({
			name: 'vendor',
			filename: 'vendor.js',
			minChunks: Infinity
		}),

        new ExtractTextPlugin({
          filename: '[name].css',
          disable: false,
          allChunks: true,
        }),

        new webpack.HotModuleReplacementPlugin(),

        // prints more readable module names in the browser console on HMR updates
        new webpack.NamedModulesPlugin(),

        new AssetsPlugin({
			filename: 'stats.generated.json',
			path: ROOT_PATH,
		}),

        //提取Loader定义到同一地方
        new webpack.LoaderOptionsPlugin({
            minimize: false,
            debug: true,
        }),
    ],

    // Ensure that webpack polyfills the following node features for use
    // within any bundles that are targetting node as a runtime. This will be
    // ignored otherwise.
    node: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      __dirname: true,
      __filename: true,
    }

};

Object.keys(config.entry).forEach((key) => {
    const _entry = config.entry[key];
    if (key === 'vendor') return;
    config.entry[key] =
	[
		'webpack-dev-server/client?http://127.0.0.1:8080',
		'webpack/hot/only-dev-server',
		_entry
	];
});

module.exports = config;
