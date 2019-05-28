# Basic setup

## Source of Instructions
https://medium.com/@binyamin/creating-a-node-express-webpack-app-with-dev-and-prod-builds-a4962ce51334

## Commands executed
* Create package.json
```npm init -y```
* Install Express server
```npm install --save express```
* Express configuration in server.js
* Install Webpack
```npm install --save-dev webpack webpack-cli webpack-node-externals```
* Install Babel
```npm install --save-dev @babel/core @babel/preset-env babel-loader```
* Install HTML loader and HTML webpack plugin
* Configure 'webpack.config.js'
* Create and configure '.babelrc'
* Install the CSS Loader
```npm install --save-dev css-loader file-loader style-loader```
* Install extract CSS
```npm install --save extract-css``` and ```extract-text-webpack-plugin```
* Install pug and pug-loader
** pug module : read pug files; pug-loader: returns the file’s content as template function so we can interpolate data in our template; html-webpack-plugin: will get the index.pug file from src folder and using the other two loaders will emit a new index.html file in the dist folder
* Install stylus and stylus-loader
```npm install --save-dev stylus-loader```
* Install copy-webpack-plugin
```npm install copy-webpack-plugin --save-dev```
* Add ESLint Code Linting
```npm install --save-dev eslint babel-eslint eslint-loader```
* Lint Add-ons
``` npm install --save-dev eslint-plugin-import eslint-plugin-node eslint-plugin-promise eslint-plugin-standard eslint-config-standard eslint-friendly-formatter```
* Add rules to modules in package.json // download the base package as required (here: airbnb base - no react)
* Configure EsLint
```./node_modules/.bin/eslint --init```
* Go to VSCode settings (CMD + ,) and turn on 'auto-fix on save'
