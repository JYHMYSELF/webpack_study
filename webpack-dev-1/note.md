## webpack安装
- 安装本地的webpack
- webpack webpack-cli -D(-D 表示开发依赖,上线的时候不需要这2个包)
## webpack可以进行0配置
`npx webapck` 默认会去找(node_modules =>.bin => webpack.cmd node_modules => webpack => bin => webpack.js)
`code runner` vs插件,用来运行代码
## 手动配置webpack
- 默认配置文件的名字 `webpack.config.js` 为什么要起名为webpack.congif.js,因为(node_modules => webpack-cli => bin => config => config-yargs.js)config-yargs.js中`defaultDescription: "webpack.config.js or webpackfile.js",`
``` 
"scripts": {
    "build": "webpack --config webpack.config.my.js"
  }
"scripts": {
    "build": "npx webpack --config webpack.config.my.js"//在脚本里 npx可以省略
  }
```

```
"scripts": {
    "build": "webpack"
  }
```
`yarn run build --config webpack.config.my.js`,
`npm run build -- --config webpack.config.my.js`
## 启动本地服务
`yarn add webpack-dev-server -D`
`npx webpack-dev-server`
`"dev": "webpack-dev-server"`
`
devServer: { //开发服务器的配置
    port: 3000,
    progress: true, //进度条
    contentBase: path.resolve(__dirname, 'build'),
    open: true, //自动打开浏览器
    compress: true, //压缩
`
## html插件(html-webpack-plugin)
`yarn add html-webpack-plugin -D`
```
let htmlWebpackPlugin = require('html-webpack-plugin')
plugins: [ // 数组 放着webpack所有的插件
    new htmlWebpackPlugin({  ////这个plugin帮做我们配置html文件中js文件的引入的.
        template: './src/index.html',
        filename: 'index.html'
    })
]
```
## 样式处理1
`yarn add css-loader style-loader -D`
```
module:{ //模块
    rules: [ //规则 css-loader => 解析@import这种语法的,也可以说解析路径
        // style-loader => 将css插入到<head></head>标签中
        //loader 的用法 单个loader用字符串 `test: /\.css$/, use: 'css-loader'`,多个loader用数组 `test: /\.css$/, use: ['style-loader','css-loader']`
        // 第二种用法 `test: /\.css$/, use: [{loader: 'style-loader', options:{}},'css-loader']`
        // loader的顺序,默认是`从右向左执行,从下    到上执行`
        {
            test: /\.css$/, use: ['style-loader','css-loader']
        },
    ]
}
```
Q:`为什么不直接在index.html页面里通过link引用css文件,而通过在index.js用require()进行引用呢?`
A:`我们会以index.html为模板,会原封不动的输出到build文件夹中,这样的话css文件就不可以打包进去了`
## 样式处理2
`yarn add mini-css-extract-plugin -D`  //抽离css插件
```
let MiniCssExtractPlugin = require('mini-css-extract-plugin')
let config = {
       module:{ //模块
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'] //MiniCssExtractPlugin.loader => 将css通过link引入到index.html页面中
            }
        ]
    } 
}
```
`yarn add postcss-loader autoprefixer` //自动加前缀插件
```
let config = {
       module:{ //模块
        rules: [    
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'] //MiniCssExtractPlugin.loader => 将css通过link引入到index.html页面中
            }
        ]
    } 
}
```
`postcss.config.js`
```
module.exports = {
    plugins: [
        require('autoprefixer')
    ]
}
```
### 压缩css文件和js文件
`yarn add optimize-css-assets-webpack-plugin`
`yarn add terser-webpack-plugin`
`yarn add uglifyjs-webpack-plugin -D`
```
<!-- const TerserJSPlugin = require('terser-webpack-plugin'); -->
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
<!-- module.exports = {
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  }
} -->
    module.exports = {
        optimization: {
            minimizer: [
                new UglifyJsPlugin({
                    cache: true, //缓存
                    parallel: true, //并发打包
                    sourceMap: true // 将es6变成es5时,需要源码映射,方便调试
                }),
                new OptimizeCssAssetsWebpackPlugin({})],
        }
    }
```
## 转换ES6语法
`yarn add babel-loader @babel/core @babel/preset-env -D`
```
rules: [
{
    test: /\.js$/,
    use: [
        {
            loader: 'babel-loader',
            options: { // 用babel-loader 将es6 => es5
                presets: [
                    '@babel/preset-env'
                ]
            }
        },
    ]
},
]
```
`yarn add @babel/plugin-proposal-class-properties` //处理class
`yarn add @babel/plugin-proposal-decorators` // 处理修饰符
```
rules: [
    {
        test: /\.js$/,
        use: [
            {
                loader: 'babel-loader',
                options: { // 用babel-loader 将es6 => es5
                    presets: [
                        '@babel/preset-env'
                    ],
                    plugins: [
                        ["@babel/plugin-proposal-decorators", { "legacy": true }], // 处理修饰符
                        ["@babel/plugin-proposal-class-properties", { "loose" : true }] //处理class
                    ]
                },
            },
        ]
    }
]
```
## 处理js语法及校验
`yarn add @babel/plugin-transform-runtime -D`
`yarn add @babel/runtime`
```
rules: [
    {
        test: /\.js$/,
        use: [
            {
                loader: 'babel-loader',
                options: { // 用babel-loader 将es6 => es5
                    presets: [
                        '@babel/preset-env'
                    ],
                    plugins: [
                        ["@babel/plugin-proposal-decorators", { "legacy": true }], // 处理修饰符
                        ["@babel/plugin-proposal-class-properties", { "loose" : true }], //处理class
                        "@babel/plugin-transform-runtime"
                    ]
                },
            },
        ]
    }
]
```
`yarn add @babel/polyfill`
```
require('babel/polyfill')
```
`yarn add eslint eslint-loader`
```
rules:[
    {
    test: /\.js$/,
    use: [
        {
            loader: 'eslint-loader',
            options: {
                enforce: 'pre' // previous post
            }
        },
    ]
}
]
除了这个,还需要在eslint官网下载`.eslintrc.json`配置文件放在项目根目录中!
```
## 全局变量引入问题