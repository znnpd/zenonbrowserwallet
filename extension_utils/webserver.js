// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';
process.env.ASSET_PATH = '/';

var WebpackDevServer = require('webpack-dev-server'),
  webpack = require('webpack'),
  config = require('./webpack.extension.config'),
  env = require('./env'),
  path = require('path');

config.plugins = [].concat(
  config.plugins || []
);

delete config.zenonBrowserWalletChromeExtensionProperties;

var compiler = webpack(config);

var server = new WebpackDevServer(
  {
    https: false,
    hot: false,
    client: false,
    host: 'localhost',
    port: env.PORT,
    static: {
      directory: path.join(__dirname, '../extension_build'),
    },
    devMiddleware: {
      publicPath: `http://localhost:${env.PORT}/`,
      writeToDisk: true,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    allowedHosts: 'all',
  },
  compiler
);

(async () => {
  await server.start();
})();
