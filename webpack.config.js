var HtmlwebpackPlugin = require('html-webpack-plugin'),
    Clean = require('clean-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    webpack = require('webpack'),
    merge = require('webpack-merge'),
    path = require('path');

// Vender Entry Point
var pkg = require('./package.json');

var TARGET = process.env.npm_lifecycle_event,
    ROOT_PATH = path.resolve(__dirname),
    APP_PATH = path.resolve(ROOT_PATH, 'app'),
    BUILD_PATH = path.resolve(ROOT_PATH, 'build');

process.env.BABEL_ENV = TARGET;

var common = {
  entry : APP_PATH,
  resolve : {
    extensions : ['', '.js', '.jsx']
  },
  output : {
    path : BUILD_PATH,
    filename : 'bundle.js'
  },
  module : {
    loaders : [{
      test : /\.jsx?$/,
      loaders : ['babel'],
      exclude : /(node_modules|server.js)/,
      include : APP_PATH
    }, {
      test : /\.css$/,
      loader : ExtractTextPlugin.extract('style', 'css'),
      include : APP_PATH
    }]
  }
};

if(TARGET === 'build') {
  module.exports = merge(common, {
    entry : {
      app : APP_PATH
    },
    output : {
      path : BUILD_PATH,
      filename : '[name].[chunkhash].js?'
    },
    devtool : 'source-map',
    plugins : [
      new Clean(['build']),
      new ExtractTextPlugin('styles.css'),
      new HtmlwebpackPlugin({
        title : 'WebPack Starter',
        inject : true,
        template : APP_PATH + '/index.html'
      }),
      new webpack.DefinePlugin({
        'process.env' : {
          // This affects react LIB Size
          'NODE_ENV' : JSON.stringify('production')
        }
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress : { warnings : false }
      })
    ]
  });
}

if(TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    devtool : 'eval-source-map',
    module : {
      loaders: [{
        test : /\.css$/,
        loaders : ['style','css'],
        include : APP_PATH
      }]
    },
    devServer : {
      historyApiFallback : true,
      port : 3030,
      hot : true,
      inline : true,
      progress : true
    },
    plugins : [
      new webpack.HotModuleReplacementPlugin()
    ]
  });
}
