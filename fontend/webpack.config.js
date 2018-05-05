var webpack = require('webpack')
var PurifyWebpack = require('purifycss-webpack')
var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var HtmlInlinkChunkPlugin = require('html-webpack-inline-chunk-plugin')
var CleanWebpackPlugin = require('clean-webpack-plugin')
var path = require('path')
var glob = require('glob-all')
var CopyWebpackPlugin = require('copy-webpack-plugin')

var extractLess = new ExtractTextWebpackPlugin({
	filename: 'css/[name]-bundle-[hash:5].css',
})

module.exports = {
	entry: {
		app: './src/app.js',
		detail: './src/detail.js',
		edit: './src/edit.js',
		'vendor': './src/js/util.js'
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'js/[name]-bundle-[hash:5].js'
	},

	// resolve: {
	//     alias: {
	//         jquery$: path.resolve(__dirname, 'src/libs/jquery.min.js')
	//     }
	// },

	module: {
		rules: [
			{
				test: /\.js$/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: ['env'],
							plugins: ["transform-runtime"],
						}
					}
				],
				include: [path.resolve(__dirname, './src')]
			},

			{
				test: /\.scss$/,
				use: extractLess.extract(
					{
						fallback: {
							loader: 'style-loader',
							options: {
								singleton: true,
								// transform: './css.transform.js'
							}
						},
						use: [
							{
								loader: 'css-loader',
								options: {
									importLoaders: 2,
									minimize: true
									// modules: true,
									// localIdentName: '[path][name]_[local]_[hash:base64:6]'
								}
								// loader: 'file-loader'
							},
							{
								loader: 'postcss-loader',
								options: {
									ident: 'postcss',
									plugins: [
										require('postcss-sprites')({
											spritePath: 'dist/assets/imgs/sprites',
											retina: true
										}),
										require('postcss-cssnext')()
									]
								}
							},
							{
								loader: 'sass-loader'
							}
						]
					})
			},

			{
				test: /\.(png|jpg|jpeg|gif)$/,
				use: [
					{
					    loader: 'file-loader',
					    options: {
					        publicPath: '',
					        outputPath: 'assets/imgs/',
					        useRelativePath: true
					    }
					}
					// {
					// 	loader: 'url-loader',
					// 	options: {
					// 		name: '[name]-[hash:5].[ext]',
					// 		limit: 1000,
					// 		outputPath: 'assets/imgs/'
					// 	}
					// },
					// {
					// 	loader: 'img-loader',
					// 	options: {
					// 		pngquant: {
					// 			quality: 80
					// 		}
					// 	}
					// }
				]
			},

			{
				test: /\.(eot|woff2?|ttf|svg)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							name: '[name]-[hash:5].[ext]',
							limit: 5000,
							publicPath: '',
							outputPath: 'dist/',
							useRelativePath: true
						}
					}
				]
			},

			{
				test: path.resolve(__dirname, 'src/app.js'),
				use: [
					// {
					//     loader: 'imports-loader',
					//     options: {
					//         $: 'jquery'
					//     }
					// }
				]
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
		// new PurifyWebpack({
		// 	paths: glob.sync([
		// 		'./*.html',
		// 		'./src/*.js'
		// 	])
		// }),
		// copy static
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, 'static'),
                to: path.resolve(__dirname, 'dist/static')
            }
        ]),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'manifest',
			children: true, // 需要查找children的共同子依赖
			minChunks: 2
		}),
		new webpack.optimize.CommonsChunkPlugin({
			names: [ 'vendor'], // 使用names效果等同于下面分开写的写法
			minChunks: 2
		}),
		//
		// new HtmlInlinkChunkPlugin({
		//     inlineChunks: ['manifest']
		// }),

		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: './index.html',
			minify: {
				collapseWhitespace: true
			},
			chunks: ['app', 'vendor']
		}),
		new HtmlWebpackPlugin({
			filename: 'detail.html',
			template: './detail.html',
			minify: {
				collapseWhitespace: true
			},
			chunks: ['detail', 'vendor']
		}),
		new HtmlWebpackPlugin({
			filename: 'edit.html',
			template: './edit.html',
			minify: {
				collapseWhitespace: true
			},
			chunks: ['edit', 'vendor']
		}),
		new webpack.optimize.UglifyJsPlugin(),
		new CleanWebpackPlugin(path.resolve(__dirname, './dist'))
	]
}