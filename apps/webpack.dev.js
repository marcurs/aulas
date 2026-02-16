/* const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { HotModuleReplacementPlugin } = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');

const devConfig = {
	mode: 'development',
	devServer: {
		port: 3000,
		contentBase: './dist',
		compress: true,
		open: true,
		hot: true,
	},
	devtool: 'eval-source-map',
	target: 'web',
	plugins: [new HotModuleReplacementPlugin(), new ReactRefreshWebpackPlugin()],
};

module.exports = merge(common, devConfig); */
const webpack = require(`webpack`);

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
	mode: 'development',
	entry: './src/index.js',
	output: {
//		publicPath: '/operacion',
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].[contenthash].js',
		publicPath: '/',
	},
	module: {
		rules: [
			{
				test: /\.js$|jsx/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env', '@babel/preset-react'],
					},
				},
			},
			// Regla para archivos .css
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
			},
			// Regla para archivos .scss
			{
				test: /\.s[ac]ss$/i,
				use: ['style-loader', 'css-loader', 'sass-loader'],
			},
			{
				test: /\.(png|jpg|jpeg|ico)$/i,
				type: 'asset/resource',
			},
		],
	},
	resolve: {
		extensions: ['.js', '.jsx'],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: 'public/index.html',
			favicon: 'public/favicon.ico',
		}),
		new webpack.HotModuleReplacementPlugin(),
	],
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		port: 4001,
		open: true,
		hot: true,
		historyApiFallback: true,
	},
};

