module.exports = function(api) {
    api.cache(true);
    return {
    // "presets": ["next/babel", ["module:metro-react-native-babel-preset"], ["module:react-native-web"]],
    //"presets": ["@babel/preset-env", "@babel/react", ["module:metro-react-native-babel-preset"]],
    "presets": ["@babel/preset-env", "@babel/react"],
    "plugins": [
        "@babel/plugin-proposal-do-expressions",
        ["react-native-web", { "commonjs": true }],
        ["module-resolver", {
            "alias": {
              "^react-native$": "react-native-web"
            }
          }] 
      ]
  }
}