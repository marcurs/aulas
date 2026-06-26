/* const { merge } = require('webpack-merge');
const common = require('./webpack.common');


const prodConfig = {
	mode: 'production',
};

module.exports = merge(common, prodConfig); */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: 'production',
	entry: './src/index.js',
	output: {
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
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.(png|jpg|jpeg|ico)$/i,
				type: 'asset/resource',
			},
		],
	},
	resolve: {
		extensions: ['.js', '.jsx'],
		alias: {
			[path.resolve(__dirname, 'src/components/config.json')]:
				path.resolve(__dirname, 'src/components/config.prod.json'),
		},
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './public/index.html',
		}),
	],
};

