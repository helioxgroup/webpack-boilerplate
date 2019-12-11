/* eslint-disable */
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

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
    entry: {
        main: './src/index.js',
    },
    output: {
        path: path.join(__dirname, 'dist/'),
        publicPath: '/',
        filename: 'assets/[name].js',
    },
    target: 'web',
    devtool: 'source-map',
    // Webpack 4 does not have a CSS minifier, although
    // Webpack 5 will likely come with one
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true, // set to true if you want JS source maps
            }),
            new OptimizeCSSAssetsPlugin({}),
        ],
    },
    module: {
        rules: [
            {
                // Transpiles ES6-8 into ES5
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                // Loads the javacript into html template provided.
                // Entry point is set below in HtmlWebPackPlugin in Plugins
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: { minimize: true },
                    },
                ],
            },
            {
                // Loads images into CSS and Javascript files
                test: /\.jpg$/,
                use: [{ loader: 'url-loader' }],
            },
            {
                // Loads CSS into a file when you import it via Javascript
                // Rules are set in MiniCssExtractPlugin
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: "sass-loader" // compiles SASS to CSS
                    }
                ]
            },
            {
                test: /\.pug$/,
                use: ['pug-loader'],
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
        new CleanWebpackPlugin(),
        new CopyPlugin([
            { from: 'src/assets', to: 'assets' },
        ]),
        new MiniCssExtractPlugin({
            filename: './assets/[name].css',
            chunkFilename: '[id].css',
        }),
    ]
        // Join  htmlPlugin array to the end of webpack plugins array.
        .concat(htmlPlugins),
};
