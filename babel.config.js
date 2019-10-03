const path = require('path');
const Config = require('./config');

module.exports = function(api) {
    api.cache(true);
    const moduleResolverConfig = {
      root: path.resolve('./'),
      alias: {
        // '@src/*': path.resolve(__dirname, 'src'),
        '@kitten/theme': path.resolve(Config.KITTEN_PATH, 'theme'),
        '@kitten/ui': path.resolve(Config.KITTEN_PATH, 'ui'),
        '@eva-design/eva': path.resolve(Config.MAPPING_PATH),
        '@eva-design/processor': path.resolve(Config.PROCESSOR_PATH),
      },
    };
    const plugins = [
      ['module-resolver', moduleResolverConfig],
    ];
    if (true) return {
      plugins,
      presets: ['module:metro-react-native-babel-preset'],
    };
    return {
    // "presets": ["next/babel", ["module:metro-react-native-babel-preset"], ["module:react-native-web"]],
    //"presets": ["@babel/preset-env", "@babel/react", ["module:metro-react-native-babel-preset"]],
    "presets": ["@babel/preset-env", "@babel/react"],
    "plugins": [
        "@babel/plugin-proposal-do-expressions",
        ["react-native-web", { "commonjs": true }],
        // ["module-resolver", {
        //     "alias": {
        //       "^react-native$": "react-native-web"
        //     }
        //   }]
      ]
  }
}