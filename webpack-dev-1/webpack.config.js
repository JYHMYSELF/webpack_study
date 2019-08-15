let path = require('path')
// 插件都是类
let HtmlWebpackPlugin = require('html-webpack-plugin')
let MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
// const TerserJSPlugin = require('terser-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

let config = {
    mode: 'development', // 2种模式,一个production,一个development
    entry: './src/index.js', //入口
    output: {
        filename: 'bundle.js', //打包后的文件名
        // filename: 'bundle.[hash:8].js', //加上hash,可以用来确保每次生成的文件名都不一样,解决缓存问题和覆盖问题
        path: path.resolve(__dirname, 'build') // !!! 路径必须是一个绝对路径
    },
    devServer: { //开发服务器的配置
        port: 3000,
        progress: true, //进度条
        contentBase: path.resolve(__dirname, 'build'),
        open: true, //自动打开浏览器
        compress: true, //压缩
    },
    plugins: [ // 数组 放着webpack所有的插件
        new HtmlWebpackPlugin({ //这个plugin帮做我们配置html文件中js文件的引入的.
            template: './src/index.html',
            filename: 'index.html',
            minify: {
                removeAttributeQuotes: true, //去除双引号
                collapseWhitespace: true //取出空格
            },
            hash: true
        }),
        new MiniCssExtractPlugin({
            filename: 'main.css'
        }),
    ],
    module: { //模块
        rules: [ //规则 css-loader => 处理@import这种语法的
            // style-loader => 将css插入到<head></head>标签中
            //loader 的用法 单个loader用字符串 `test: /\.css$/, use: 'css-loader'`,多个loader用数组 `test: /\.css$/, use: ['style-loader','css-loader']`
            // 第二种用法 `test: /\.css$/, use: [{loader: 'style-loader', options:{}},'css-loader']`
            // loader的顺序,默认是从右向左执行,从下到上执行
            {
                // test: /\.css$/,
                // use: [{
                //     loader: 'style-loader',
                //     options: {
                //         insertAt: 'top'
                //     }
                // }, 'css-loader']
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'] //MiniCssExtractPlugin.loader => 将css通过link引入到index.html页面中
            },
            {
                // test: /\.less$/,
                // use: [{
                //     loader: 'style-loader',
                //     options: {
                //         insertAt: 'top'
                //     }
                // },'css-loader', 'less-loader']
                test: /\.less$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader']
            },
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
                            ],
                        },
                    },
                ],
                include: path.resolve(__dirname,'src'),
                exclude: /node_modules/
            },
            // {
            //     test: /\.js$/,
            //     use: [
            //         {
            //             loader: 'eslint-loader',
            //             options: {
            //                 enforce: 'pre' // previous post
            //             }
            //         },
            //     ]
            // }
        ]
    },
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

module.exports = config
// node中的知识,__dirname,__dirname 总是指向被执行 js 文件的绝对路径，所以当你在 /d1/d2/myscript.js 文件中写了 __dirname， 它的值就是 /d1/d2 。
// 