const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Customize the config to handle Node.js modules
  if (!config.resolve.fallback) {
    config.resolve.fallback = {};
  }
  
  // Add Node.js module polyfills
  Object.assign(config.resolve.fallback, {
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    buffer: require.resolve('buffer'),
    vm: false, // Disable 'vm' module as it cannot be polyfilled
    fs: false,
    path: require.resolve('path-browserify'),
    os: require.resolve('os-browserify/browser'),
    zlib: require.resolve('browserify-zlib'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    constants: false,
    assert: require.resolve('assert')
  });

  // Add buffer to the plugins
  config.plugins.push(
    new (require('webpack').ProvidePlugin)({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    })
  );

  // Add aliases for react-native-svg
  if (!config.resolve.alias) {
    config.resolve.alias = {};
  }
  
  config.resolve.alias['react-native-svg'] = 'react-native-svg-web';

  return config;
}; 