// webpack.prod.config.js
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require("clean-webpack-plugin"); //去除build文件中的残余文件 

module.exports = {
    entry: __dirname + "/app/main.js", //已多次提及的唯一入口文件
    output: {
        path: __dirname + "/build",
        filename: "bundle-[hash].js"//打包后输出文件的文件名，此为添加缓存处理
    },
    devtool: 'null', //注意修改了这里，这能大大压缩我们的打包代码
    devServer: {
        contentBase: "./build", //本地服务器所加载的页面所在的目录
        historyApiFallback: true, //不跳转
        inline: true,
        hot: true
    },
    module: {
        rules: [{
            test: /(\.jsx|\.js)$/,
            use: {
                loader: "babel-loader"
            },
            exclude: /node_modules/
        }, {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: [{
                    loader: "css-loader",
                    options: {
                        modules: true, // 指定启用css modules
                        localIdentName: '[name]__[local]--[hash:base64:5]' // 指定css的类名格式
                    }
                }, {
                    loader: "postcss-loader"
                }],
            })
        }]
    },
    plugins: [
        new webpack.BannerPlugin('版权所有，翻版必究'),
        new HtmlWebpackPlugin({
            template: __dirname + "/app/index.tmpl.html" //new 一个这个插件的实例，并传入相关的参数
        }),
        new CleanWebpackPlugin('build/*.*', { // 相当于清空build文件夹操作
            root: __dirname,
            verbose: true,
            dry: false
        }),
        new webpack.HotModuleReplacementPlugin(), //热加载插件
        new webpack.optimize.OccurrenceOrderPlugin(), //为组件分配ID
        new webpack.optimize.UglifyJsPlugin(), // 压缩JS代码
        new ExtractTextPlugin("style.css") // 分离CSS和JS文件
    ],
};