// Learn more on how to config.
// - https://github.com/ant-tool/atool-build#配置扩展

const webpack = require('atool-build/lib/webpack');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

const isProd = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';

module.exports = function(webpackConfig) {
  webpackConfig.babel.plugins.push('transform-runtime');
  webpackConfig.babel.plugins.push('transform-decorators-legacy');
  webpackConfig.babel.plugins.push(['antd', {
    style: 'css',  // if true, use less
  }]);

  // Enable this if you have to support IE8.
  webpackConfig.module.loaders.unshift({
    test: /\.jsx?$/,
    loader: 'es3ify-loader',
  });

  // Parse all less files as css module.
  webpackConfig.module.loaders.forEach(function(loader, index) {
    if (typeof loader.test === 'function' && loader.test.toString().indexOf('\\.less$') > -1) {
      loader.test = /\.dont\.exist\.file/;
    }
    if (loader.test.toString() === '/\\.module\\.less$/') {
      loader.test = /\.less$/;
    }
  });

  // 多入口
  /*  const files = glob.sync('./src/entries*//*.js');
  const newEntries = files.reduce(function(memo, file) {
    const name = path.basename(file, '.js');
    memo[name] = file;
    return memo;
  }, {});
  webpackConfig.entry = Object.assign({}, webpackConfig.entry, newEntries);*/

  /**
   * 全局别名，可以 require('src') 这样使用
   */
  webpackConfig.resolve.alias = {
    /**
     * 公共 Path
     */
    src: `${__dirname}/src`,

    api: `${__dirname}/src/api`,
    common: `${__dirname}/src/common`,
    components: `${__dirname}/src/components`, // 组件
    configuration: `${__dirname}/src/configuration`, // 配置
    constants: `${__dirname}/src/constants`,
    pages: `${__dirname}/src/pages`,
    services: `${__dirname}/src/services`,
    store: `${__dirname}/src/store`,
    util: `${__dirname}/src/util`,

  };
  webpackConfig.plugins.push(
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  );

 var [CommonsChunkPlugin, ExtractTextPlugin, OccurrenceOrderPlugin, ProgressPlugin, NpmInstallPlugin, ...more] = webpackConfig.plugins;
  webpackConfig.plugins= [CommonsChunkPlugin, ExtractTextPlugin, OccurrenceOrderPlugin, ProgressPlugin, ...more];

  return webpackConfig;
};
