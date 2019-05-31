/* eslint-disable */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


// Nodes fs module to read directory contents
const fs = require('fs');

// Function to walk through files and directories at a given path
function walkDir(rootDir) {
    const paths = [];
    // A recursive function
    // - If a path is a file it will add to an array to be returned
    // - If a path is a directory it will call itself on the directory
    function walk(directory, parent) {
        const dirPath = path.resolve(__dirname, directory);
        const templateFiles = fs.readdirSync(dirPath);

        // Check each path found, add files to array and call self on directories found
        templateFiles.forEach((file) => {
            const filepath = path.resolve(__dirname, directory, file);
            const isDirectory = fs.lstatSync(filepath).isDirectory();

            if (isDirectory) {
                // File is a directory
                const subDirectory = path.join(directory, file);
                if (parent) {
                    // Join parent/file before passing so we have correct path
                    const parentPath = path.join(parent, file);
                    walk(subDirectory, parentPath);
                } else {
                    walk(subDirectory, file);
                }
            } else if (parent) {
                // Parent exists, join it with file to create the pat¨h
                const fileWithParent = path.join(parent, file);
                paths.push(fileWithParent);
            } else {
                paths.push(file);
            }
        });
    }

    // Start our function, it will call itself until there no paths left
    walk(rootDir);

    return paths;
}

// Generates html plugins
function generateHtmlPlugins(templateDir) {
    // Read files in template directory
    const templateFiles = walkDir(templateDir);
    return templateFiles.map((item) => {
        // Split names and extension
        const parts = item.split('.');
        const name = parts[0];
        const extension = parts[1];
        // Create new HTMLWebpackPlugin with options
        return new HtmlWebpackPlugin({
            filename: `${name}.html`,
            template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
        });
    });
}

const htmlPlugins = generateHtmlPlugins('./src/views');


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
                    },
                ],
            },
            {
                test: /\.(styl|stylus)$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            modules: true,
                            localIdentName: '[local]___[hash:base64:5]',
                        },
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
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
            },
            {
                test: /\.(csv|tsv)$/,
                use: ['csv-loader'],
            },
            {
                test: /\.xml$/,
                use: ['xml-loader'],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: './assets/[name].css',
            chunkFilename: '[id].css',
        }),

    ].concat(htmlPlugins),
};
