var webpack = require('webpack'),
  path = require('path'),
  fileSystem = require('fs-extra'),
  env = require('./env'),
  CopyWebpackPlugin = require('copy-webpack-plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  TerserPlugin = require('terser-webpack-plugin');
var { CleanWebpackPlugin } = require('clean-webpack-plugin');

const ASSET_PATH = process.env.ASSET_PATH || '/';

var alias = {
  'react-dom': '@hot-loader/react-dom',
};

var fileExtensions = [
  'jpg',
  'jpeg',
  'png',
  'gif',
  'eot',
  'otf',
  'svg',
  'ttf',
  'woff',
  'woff2',
];

var options = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    index: './src/index.tsx',
    contentScript: './extension_scripts/contentScript.js',
    backgroundScript: './extension_scripts/backgroundScript.js'
  },
  zenonBrowserWalletChromeExtensionProperties: {
    // list of components that must not be hot-reloaded
    notHotReload: [],
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../extension_build'),
    clean: true,
    publicPath: ASSET_PATH,
    library: 'Zenon',
    libraryTarget: 'umd',
    libraryExport: 'default'
  },
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
        // look for .css or .scss files
        test: /\.(css|scss)$/,
        // in the `src` directory
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: new RegExp('.(' + fileExtensions.join('|') + ')$'),
        type: 'asset/resource',
        exclude: /node_modules/,
        // loader: 'file-loader',
        // options: {
        //   name: '[name].[ext]',
        // },
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        exclude: /node_modules/,
      },
      { test: /\.(ts|tsx)$/, loader: 'ts-loader', exclude: /node_modules/ },
      {
        test: /\.(js|jsx)$/,
        use: [
          {
            loader: 'source-map-loader',
          },
          {
            loader: 'babel-loader',
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    alias: alias,
    extensions: fileExtensions
      .map((extension) => '.' + extension)
      .concat(['.js', '.jsx', '.ts', '.tsx', '.css']),
    fallback: {
        path: false,
        fs: false,
        Buffer: false,
        process: false,
        stream: require.resolve("stream-browserify"),
        buffer: require.resolve("buffer/")
    }
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
    new CleanWebpackPlugin({ verbose: false }),
    new webpack.ProgressPlugin(),
    // expose and write the allowed env vars on the compiled bundle
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './src/manifest.json',
          to: '../extension_build',
          force: true,
          transform: function (content, path) {
            // generates the manifest file using the package.json informations
            return Buffer.from(
              JSON.stringify({
                description: process.env.npm_package_description,
                version: process.env.npm_package_version,
                ...JSON.parse(content.toString()),
              })
            );
          },
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      chunks: ['index'],
      cache: false,
    })
  ],
  infrastructureLogging: {
    level: 'info',
  },
};

if (env.NODE_ENV === 'development') {
  options.devtool = 'cheap-module-source-map';
} else {
  options.optimization = {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  };
}

module.exports = options;
