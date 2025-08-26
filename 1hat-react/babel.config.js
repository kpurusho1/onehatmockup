module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Use the worklets plugin for Reanimated v4
      'react-native-worklets/plugin',
    ],
  };
};
