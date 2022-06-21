const {merge} = require('webpack-merge');
const common = require('./webpack.common.js');
const fs = require("fs");
const babelrc = JSON.parse(fs.readFileSync(`${__dirname}/.babelrc`, 'utf8'));
const config = require('config');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const {sep} = path;

const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    plugins: [
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, 'src', 'index.html'),
        }),
        new ReactRefreshWebpackPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.[j]sx?$/,
                exclude: /node_modules/,
                include: [
                    /src/,
                    new RegExp(`node_modules${sep}lit-html`),
                    new RegExp(`node_modules${sep}lit-element`)
                ],
                loader: 'babel-loader',
                options: {
                    plugins: ['react-refresh/babel'],
                    ...babelrc
                },
            },
        ],
    },
    devServer: {
        devMiddleware: {
            index: true,
            publicPath: '/zenon',
            writeToDisk: true,
        },
        port: 3000,
        compress: true,
        // must be true for SPAs
        historyApiFallback: {
            index: '/zenon',
            verbose: true
        },
        hot: 'only',
        // open browser on server start
        open: false,
    },
});
