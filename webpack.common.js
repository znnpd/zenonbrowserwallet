const path = require('path');
const fs = require('fs');
const webpack = require('webpack');

const babelrc = JSON.parse(fs.readFileSync(`${__dirname}/.babelrc`, 'utf8'));
const {sep} = path;

/*-------------------------------------------------*/

// for webpack builds we choose dist. rollup builds go to lib
const outputPath = 'dist';

// Attempt to resolve these extensions in order.
const extensions = ['.js', '.jsx', '.ts', '.tsx'];

module.exports = {
    // webpack optimization mode
    mode: process.env.NODE_ENV ? process.env.NODE_ENV : 'development',

    // entry file(s)
    entry: './src/index.tsx',

    // output file(s) and chunks
    output: {
        library: 'Zenon',
        libraryTarget: 'umd',
        libraryExport: 'default',
        path: path.resolve(__dirname, outputPath),
        publicPath: '/zenon'
    },

    plugins: [
        // Work around for Buffer is undefined:
        // https://github.com/webpack/changelog-v5/issues/10
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
    ],

    resolve: {
        extensions,
        alias: {
            // resolve ~/ imports to src/
            '~': path.resolve(__dirname, 'src/')
        },
        fallback: {
            path: false,
            fs: false,
            Buffer: false,
            process: false,
            stream: require.resolve("stream-browserify"),
            "buffer": require.resolve("buffer/")
        }
    },

    // module/loaders configuration
    module: {
        noParse: /\.wasm$/,
        rules: [
            {
                test: /\.wasm$/,
                // Tells WebPack that this module should be included as
                // base64-encoded binary file and not as code
                loader: 'base64-loader',
                // Disables WebPack's opinion where WebAssembly should be,
                // makes it think that it's not WebAssembly
                //
                // Error: WebAssembly module is included in initial chunk.
                type: 'javascript/auto',
            },
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                include: [
                    /src/,
                    new RegExp(`node_modules${sep}lit-html`),
                    new RegExp(`node_modules${sep}lit-element`),
                    new RegExp(`node_modules${sep}@axa-ch(?!${sep}patterns-library-polyfill)`)
                ],
                use: {
                    loader: 'ts-loader'
                }
            },
            {
                test: /.(js|jsx)$/,
                exclude: /node_modules/,
                include: [
                    /src/,
                    new RegExp(`node_modules${sep}lit-html`),
                    new RegExp(`node_modules${sep}lit-element`),
                    new RegExp(`node_modules${sep}@axa-ch(?!${sep}patterns-library-polyfill)`)
                ],
                use: {
                    loader: 'babel-loader',
                    options: {
                        ...babelrc
                    }
                }
            },
            {
                test: /.(png|jpg|gif)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192
                        }
                    }
                ]
            },
            {
                test: /.s?css$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: 'babel-loader'
                    },
                    {
                        loader: 'react-svg-loader',
                        options: {
                            jsx: true, // true outputs JSX tags,
                            svgo: {
                                plugins: [{removeViewBox: false}],
                                floatPrecision: 2
                            }
                        }
                    }
                ]
            }
        ]
    },

    // generate source map
    devtool: process.env.NODE_ENV === 'production' ? '' : 'source-map'
};
