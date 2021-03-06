const productionConfig = require('./webpack.prod.conf')
const developmentConfig = require('./webpack.dev.conf')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')
const path = require('path')
const webpack = require('webpack')

const generateConfig = env => {
	const extractLess = new ExtractTextWebpackPlugin({
		filename: 'css/[name]-bundle-[hash:5].css',
	})

	const scriptLoader = ['babel-loader']
		.concat(env === 'production'
			? []
			: [
				//   {
				//     loader: 'eslint-loader',
				//     options: {
				//         formatter: require('eslint-friendly-formatter')
				//     }
				// }
			]
		)
	const cssLoaders = [
		{
			loader: 'css-loader',
			options: {
				importLoaders: 2,
				sourceMap: env === 'development'
			}
		},
		{
			loader: 'postcss-loader',
			options: {
				ident: 'postcss',
				sourceMap: env === 'development',
				plugins: [
					require('postcss-cssnext')()
				].concat(
					env === 'production'
						? require('postcss-sprites')({
						spritePath: 'dist/assets/imgs/sprites',
						retina: true
					})
						: []
				)
			}
		},
		{
			loader: 'sass-loader',
			options: {
				sourceMap: env === 'development'
			}
		}
	]
	const styleLoader = env === 'production'
		? extractLess.extract({
			fallback: 'style-loader',
			use: cssLoaders
		})
		: [{
			loader: 'style-loader'
		}].concat(cssLoaders)

	const fileLoader = path => {
		return env === 'development'
			? [{
				loader: 'file-loader',
				options: {
					name: '[name]-[hash:5].[ext]',
					outputPath: path
				}
			}]
			: [{
				loader: 'url-loader',
				options: {
					name: '[name]-[hash:5].[ext]',
					limit: 1000,
					outputPath: path
				}
			}]
	}

	return {
		entry: {
			app: './src/app.js',
			detail: './src/detail.js',
			edit: './src/edit.js',
			error: './src/error.js',
			search: './src/search.js',
			login: './src/login.js',
			manage: './src/manage.js'
		},

		output: {
			path: path.resolve(__dirname, '../dist'),
			publicPath: '/',
			filename: 'js/[name]-bundle-[hash:5].js'
		},

		resolve: {
			alias: {
				jquery$: path.resolve(__dirname, '../src/libs/jquery.min.js')
			}
		},

		module: {
			rules: [
				{
					test: /\.js$/,
					include: [path.resolve(__dirname, '../src')],
					exclude: [path.resolve(__dirname, '../src/libs')],
					use: scriptLoader
				},

				{
					test: /\.scss$/,
					use: styleLoader
				},

				{
					test: /\.(png|jpg|jpeg|gif)$/,
					use: fileLoader('assets/imgs/').concat(
						env === 'production'
							? {
							loader: 'img-loader',
							options: {
								pngquant: {
									quality: 80
								}
							}
						}
							: []
					)
				},

				{
					test: /\.(eot|woff2?|ttf|svg)$/,
					use: fileLoader('assets/imgs/')
				},

				{
					test: /\.html$/,
					use: [
						{
							loader: 'html-loader',
							options: {
								attrs: ['img:src', 'img:data-src']
							}
						}
					]
				}
			]
		},

		plugins: [
			extractLess,

			new HtmlWebpackPlugin({
				filename: 'index.html',
				template: './index.html',
				minify: {
					collapseWhitespace: true
				},
				chunks: ['app']
			}),
			new HtmlWebpackPlugin({
				filename: 'detail.html',
				template: './detail.html',
				minify: {
					collapseWhitespace: true
				},
				chunks: ['detail']
			}),
			new HtmlWebpackPlugin({
				filename: 'edit.html',
				template: './edit.html',
				minify: {
					collapseWhitespace: true
				},
				chunks: ['edit']
			}),
			new HtmlWebpackPlugin({
				filename: 'error.html',
				template: './error.html',
				minify: {
					collapseWhitespace: true
				},
				chunks: ['error']
			}),
			new HtmlWebpackPlugin({
				filename: 'search.html',
				template: './search.html',
				minify: {
					collapseWhitespace: true
				},
				chunks: ['search']
			}),
			new HtmlWebpackPlugin({
				filename: 'login.html',
				template: './login.html',
				minify: {
					collapseWhitespace: true
				},
				chunks: ['login']
			}),
			new HtmlWebpackPlugin({
				filename: 'manage.html',
				template: './manage.html',
				minify: {
					collapseWhitespace: true
				},
				chunks: ['manage']
			})
		]
	}
}

module.exports = env => {
	let config = env === 'production'
		? productionConfig
		: developmentConfig

	return merge(generateConfig(env), config)
}