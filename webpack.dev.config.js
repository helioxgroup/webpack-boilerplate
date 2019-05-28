const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    mode: 'development',

    entry: {
        app: './src/index.js',
    },

    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },

    target: 'web',
    devtool: 'inline-source-map',
    devServer: {
        // contentBase: "./dist",
        contentBase: path.resolve(__dirname, './src/views'),
        // contentBase: [path.join(__dirname, 'public'), path.join(__dirname, 'assets')]
        watchContentBase: true,
        compress: true,
        port: 8080,
        overlay: true,
        hot: true,
        // hotOnly: true
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                exclude: '/node_modules/',
                options: {
                    formatter: require('eslint-friendly-formatter'),
                    emitWarning: true,
                },
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                // Loads the javacript into html template provided.
                // Entry point is set below in HtmlWebPackPlugin in Plugins
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        // options: { minimize: true }
                    },
                ],
            },
            {
                test: /\.styl$/,
                use: [
                    {
                        loader: 'style-loader', // creates style nodes from JS strings
                    },
                    {
                        loader: 'css-loader', // translates CSS into CommonJS
                    },
                    {
                        loader: 'stylus-loader', // compiles Stylus to CSS
                    },
                ],
            },
            {
                test: /\.pug$/,
                use: ['pug-loader'],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: ['file-loader'],
            },
        ],
    },
    plugins: [
        // new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            // title: "Development",
            template: './src/views/index.pug',
            // filename: "./index.html"
            // excludeChunks: ["server"]
        }),
    ],
};
