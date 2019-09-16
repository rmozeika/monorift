
var webpack = require('webpack');
var path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");

var src = path.join(__dirname, './src');

module.exports = {
    entry: [
        path.join(src, 'index.js')
    ],
    module: {
        rules: [
            {
                use: {
                    loader: 'babel-loader',
                    options: {
                      presets: ['@babel/preset-env']
                    }
                },
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
            },
            {
                test: /\.html$/,
                use: [
                  {
                    loader: "html-loader"
                  }
                ]
            },
            {
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                loader: require.resolve('url-loader'),
                options: {
                  limit: 10000,
                  name: 'static/media/[name].[hash:8].[ext]',
                },
            },
            {
                test: /\.(js|jsx|mjs)$/,
                include: [
                  path.resolve(__dirname, 'node_modules/react-native-elements'),
                  path.resolve(__dirname, 'node_modules/react-native-elements/src'),
      
                  path.resolve(__dirname, 'node_modules/react-native-vector-icons'),
                  path.resolve(__dirname, 'node_modules/react-native-ratings'),
                  // path.resolve(__dirname, 'node_modules/react-native-material-kit'),
                  path.resolve(__dirname, 'node_modules/native-base-shoutem-theme'),
                  path.resolve(__dirname, 'node_modules/react-navigation'),
                  path.resolve(__dirname, 'node_modules/react-native-easy-grid'),
                  path.resolve(__dirname, 'node_modules/react-native-drawer'),
                  path.resolve(__dirname, 'node_modules/react-native-safe-area-view'),
                  path.resolve(__dirname, 'node_modules/react-native-vector-icons'),
                  path.resolve(__dirname, 'node_modules/react-native-keyboard-aware-scroll-view'),
                  path.resolve(__dirname, 'node_modules/react-native-web'),
                  path.resolve(__dirname, 'node_modules/react-native-tab-view'),
                  path.resolve(__dirname, 'node_modules/static-container'),
                  path.resolve(__dirname, 'node_modules/react-native-ui-kitten'),

      
                ],
                loader: require.resolve('babel-loader'),
                    
                    options: {
                      presets: ["module:metro-react-native-babel-preset", "@babel/react"],
                      // presets: ['react-native'],
      
                      // Re-write paths to import only the modules needed by the app
                      plugins: ['react-native-web', "@babel/plugin-syntax-dynamic-import"],
                      // This is a feature of `babel-loader` for webpack (not Babel itself).
                      // It enables caching results in ./node_modules/.cache/babel-loader/
                      // directory for faster rebuilds.
                      cacheDirectory: true,
                    }
              }
        ]
        
    },
    resolve: {
        alias: {
            // Support React Native Web
            // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
            'react-native': 'react-native-web',
          },
    },
    plugins: [
        new HtmlWebPackPlugin({
          template: "./src/public/index.html",
          filename: "./index.html"
        })
      ],
    output: {
        path: path.join(__dirname, 'dist.web'),
        filename: '[name].bundle.js'
    },
    devtool: 'source-map',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000
    }
}