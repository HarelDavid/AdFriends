var webpack = require('webpack');
var path = require('path');
var loaders = require('./webpack.loaders');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	entry: [
		'./src/index.jsx' // Your appʼs entry point
	],
	output: {
		path: path.join(__dirname, 'public'),
		filename: 'bundle-[hash:6].js'
	},

	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	module: {
		loaders: loaders.concat([{
			test: /\.(css|scss|saas)$/,
			loaders: [
				'style?sourceMap',
				'css?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
				'resolve-url',
				'sass?sourceMap'
			]
		},
			{
				test: /\.(eot|svg|ttf|woff)$/,
				loader: 'file?name=src/fonts/[name].[ext]'
			}
		])
	},
	plugins: [
		new CopyWebpackPlugin([{
			from: './index.html'
		}]),
	]
};
