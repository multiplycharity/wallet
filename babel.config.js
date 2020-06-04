module.exports = function (api) {
  api.cache(true)
  return {
    presets: [
      '@babel/preset-env',
      'babel-preset-expo',
      'module:metro-react-native-babel-preset',
      'module:react-native-dotenv'
    ],
    plugins: [['@babel/plugin-proposal-optional-chaining']]
  }
}
