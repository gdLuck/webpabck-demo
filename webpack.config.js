const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 依据一个简单的index.html模板，生成一个自动引用你打包后的JS文件的新index.html
const ExtractTextPlugin = require('extract-text-webpack-plugin'); // 分离CSS和JS文件
const CleanWebpackPlugin = require("clean-webpack-plugin"); // 去除build文件中的残余文件 

module.exports = {
  devtool: 'eval-source-map',
  entry:  {
    app: ['babel-polyfill','./app/main.js']
  },//唯一入口文件
  output: {
    path: __dirname + "/build",//打包后的文件存放的地方
    filename: "bundle.js"
    // filename: "bundle-[hash].js"//打包后输出文件的文件名，此为添加缓存处理
  },
  devServer: {
    contentBase: "./build",//本地服务器所加载的页面所在的目录
    historyApiFallback: true,//不跳转
    inline: true,//实时刷新
    hot: true // 热更新
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        use: {
            loader: "babel-loader",
        },
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              modules: true, // 指定启用css modules
              localIdentName: '[name]__[local]--[hash:base64:5]' // 指定css的类名格式
            }
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: function() {
                return [
                  require('autoprefixer')
                ];
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin('版权所有，翻版必究'),
    new webpack.HotModuleReplacementPlugin(),//热加载插件 JS模块部分
    new HtmlWebpackPlugin({ // 依据一个简单的index.html模板，生成一个自动引用你打包后的JS文件的新index.html
      template: __dirname + "/app/index.tmpl.html"//new 一个这个插件的实例，并传入相关的参数
    }),
    // new CleanWebpackPlugin('build/*.*', { // 相当于清空build文件夹操作
    //   root: __dirname,
    //   verbose: true,
    //   dry: false
    // })
    new webpack.optimize.OccurrenceOrderPlugin(), //为组件分配ID
    // new webpack.optimize.UglifyJsPlugin(), // 压缩JS代码
    new ExtractTextPlugin("style.css") // 分离CSS和JS文件
  ]
}
