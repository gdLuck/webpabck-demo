### 安装 

```
//全局安装
npm install -g webpack

//安装到你的项目目录(此配合配置文件一起使用)
npm install --save-dev webpack

例：
npm init 
npm i --save-dev webpack
```

### 配置配置文件

> 根目录新建文件： webpack.config.js

```
内容：
module.exports = {
  entry:  __dirname + "/app/main.js",//已多次提及的唯一入口文件
  output: {
    path: __dirname + "/public",//打包后的文件存放的地方
    filename: "bundle.js"//打包后输出文件的文件名
  }
}

```

> 添加npm start形式命令行快捷安装方式

package.json 文件添加配置
```
"scripts": {
    "start": "webpack" //配置的地方就是这里啦，相当于把npm的start命令指向webpack命令
  },
```

### 生成Source Maps

webpack 配置文件添加

```
 devtool: 'eval-source-map',//配置生成Source Maps，选择合适的选项
 
 其他选项：
 source-map  最好，速度慢
 cheap-module-source-map  不带映射，速度中，调试不便
 eval-source-map  开发使用
 cheap-module-eval-source-map  同一
```

### 本地服务功能
npm install --save-dev webpack-dev-server

```
devserver的配置选项
contentBase	  默认webpack-dev-server会为根文件夹提供本地服务器，如果想为另外一个目录下的文件提供本地服务器，应该在这里设置其所在目录（本例设置到“public"目录）
port	 设置默认监听端口，如果省略，默认为”8080“
inline	 设置为true，当源文件改变时会自动刷新页面
historyApiFallback	  在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html

```


```
使用配置示例：
"scripts": {
    "start": "webpack",
    "server": "webpack-dev-server --open"
  },
```



### Loaders 使用

> 安装可以装换JSON的loader webpack1.* 版本需要，后续版本无需
npm install --save-dev json-loader


```
// npm一次性安装多个依赖模块，模块之间用空格隔开

// JS babel支持 Babel其实是一个编译JavaScript的平台
// env 支持所有的 babel-preset-es 和 babel-preset-stag
npm install --save-dev babel-core babel-loader  // 主体
npm install --save-dev babel-preset-env babel-preset-react // 其他

//安装 react 工具
npm install --save react react-dom

//安装css 工具
npm install --save-dev style-loader css-loader

// css 自动添加适应不同浏览器的CSS前缀  autoprefixer（自动添加前缀的插件）
npm install --save-dev postcss-loader autoprefixer

```

```
test：一个匹配loaders所处理的文件的拓展名的正则表达式（必须）
loader：loader的名称（必须）
include/exclude:手动添加必须处理的文件（文件夹）或屏蔽不需要处理的文件（文件夹）（可选）；
query：为loaders提供额外的设置选项（可选）

主配置文件：
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require("clean-webpack-plugin"); //去除build文件中的残余文件 

module.exports = {
  devtool: 'eval-source-map',
  entry:  __dirname + "/app/main.js",//已多次提及的唯一入口文件
  output: {
    path: __dirname + "/build",//打包后的文件存放的地方
    filename: "bundle-[hash].js"//打包后输出文件的文件名，此为添加缓存处理
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
            loader: "postcss-loader"
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
    new CleanWebpackPlugin('build/*.*', { // 相当于清空build文件夹操作
      root: __dirname,
      verbose: true,
      dry: false
    })
    // new webpack.optimize.OccurrenceOrderPlugin(), //为组件分配ID
    // new webpack.optimize.UglifyJsPlugin(), // 压缩JS代码
    // new ExtractTextPlugin("style.css") // 分离CSS和JS文件
  ]
}


```

> .babelrc 配置

```
{
  "presets": ["env", "react"],
  "env": {
    "development": {
      "plugins": [["react-transform", {
        "transforms": [{
          "transform": "react-transform-hmr",
          
          "imports": ["react"],
          
          "locals": ["module"]
        }]
      }]]
    }
  }
}
```


### 插件使用

> 常用的插件

- HtmlWebpackPlugin
```
// 根据模版生成文件
npm install --save-dev html-webpack-plugin
// 建立模版文件
// 设置配置
new HtmlWebpackPlugin({ // 依据一个简单的index.html模板，生成一个自动引用你打包后的JS文件的新index.html
  template: __dirname + "/app/index.tmpl.html"//new 一个这个插件的实例，并传入相关的参数
})
```
- Hot Module Replacement

```
// 热加载支持
在webpack配置文件中添加HMR插件；
在Webpack Dev Server中添加“hot”参数；

//Babel有一个叫做react-transform-hrm的插件，可以在不对React模块进行额外的配置的前提下让HMR正常工作；
npm install --save-dev babel-plugin-react-transform react-transform-hmr
```



### 产品阶段构建

- 新建线上配置文件 webpack.production.config.js，添加相应配置

```
拷贝webpack.config.js内容，并主要修改：（可优化为基本配置文件与开发配置和生产配置）

devtool: 'null', //注意修改了这里，这能大大压缩我们的打包代码
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
                        modules: true
                    }
                }, {
                    loader: "postcss-loader"
                }],
            })
        }]
    }
```

- 修改 package.json 文件：

```
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "webpack",
    "server": "webpack-dev-server --open",
    "build": "NODE_ENV=production webpack --config ./webpack.production.config.js --progress"
  }
注意:如果是window电脑，build需要配置为"build": "set NODE_ENV=production && webpack --config ./webpack.production.config.js --progress".
```

### 发布环境 优化插件

- OccurenceOrderPlugin :（内置插件）为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块，并为它们分配最小的ID
- UglifyJsPlugin：（内置插件）压缩JS代码；
- ExtractTextPlugin：分离CSS和JS文件

> 安装非内置插件 

```
npm install --save-dev extract-text-webpack-plugin
```

> 缓存处理

```
输出文件名修改为
filename: "bundle-[hash].js"
```

> 添加缓存后残留文件处理

```
添加了hash之后，会导致改变文件内容后重新打包时，文件名不同而内容越来越多，因此这里介绍另外一个很好用的插件clean-webpack-plugin。

npm install clean-webpack-plugin --save-dev

```



