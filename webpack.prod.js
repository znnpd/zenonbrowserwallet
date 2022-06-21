const {merge} = require('webpack-merge');
const common = require('./webpack.common.js');
const HTMLWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const fs = require("fs");
const {sep} = path;
const babelrc = JSON.parse(fs.readFileSync(`${__dirname}/.babelrc`, 'utf8'));

module.exports = merge(common, {
    mode: 'production',
    module: {
        rules: [
            {
                test: /.(js|jsx)$/,
                exclude: /node_modules/,
                include: [
                    /src/,
                    new RegExp(`node_modules${sep}lit-html`),
                    new RegExp(`node_modules${sep}lit-element`)
                ],
                use: {
                    loader: 'babel-loader',
                    options: {
                        ...babelrc
                    }
                }
            },
        ],
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, 'src', 'index.html'),
        })
    ],
});
