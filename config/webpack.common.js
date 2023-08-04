const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
// const SpeedMeasurePlugin = require("speed-measure-webpack-plugin"); //시간측정
// const smp = new SpeedMeasurePlugin();
//스타일 코드를 청크(Chunk)에서 파일로 추출하므로 개발 중에는 플러그인을 사용하지 않는 것이 좋습니다.
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isDevelopment = process.env.NODE_ENV.trim() === "development";
module.exports = {
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    compress: true,
    port: 3303,
    proxy: {
      "/api": "http://127.0.0.1:3333", //"http://127.0.0.1:3301",
    },
    historyApiFallback: true, //SPA에서 history API를 사용해 주소가 변경되는 것을 저장하려고 할 때 쓰입니다.
  },
  entry: {
    // main: "./src/index.js",
    index: "./src/index.js",
    // mgr: "./src/mgr/pages/login/MgrLogin.jsx",
    // mgr_main: "./src/mgr/pages/main/MgrMain.jsx",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|mjs)$/,
        exclude: /node_modules/,
        loader: require.resolve("babel-loader"),
        options: {
          cacheDirectory: true,
          presets: ["@babel/preset-env"],
        },
      },
      {
        oneOf: [
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
            type: "asset",
          },
          {
            test: [/\.s(a|c)ss$/i],
            use: [
              isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
              {
                loader: "css-loader",
                options: {
                  importLoaders: 1,
                  sourceMap: isDevelopment,
                  modules: {
                    localIdentName: "[path][name]__[local]--[hash:base64:5]",
                  },
                },
              },
              "postcss-loader",
              {
                loader: "sass-loader",
                options: {
                  sourceMap: isDevelopment,
                },
              },
            ],
            sideEffects: true,
          },
          {
            test: /\.(bmp|svg|png|jpe?g|gif)$/i,
            loader: require.resolve("file-loader"),
            options: {
              name: "images/[contenthash].[ext]",
            },
          },
        ],
      },
    ],
  },
  node: {
    // global: true,
    // __filename: false,
    // __dirname: false,
  },
  output: {
    path: path.resolve(__dirname, "../dist"),
    // filename: "bundle.js",
    filename: '[name].bundle.js',
    publicPath: "/",
  },
  resolve: {
    //필요한 정보 제공
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    extensions: [
      ".web.js",
      ".mjs",
      ".js",
      ".json",
      ".web.jsx",
      ".jsx",
      ".scss",
    ],
    alias: {
      utils: path.resolve("src/utils"),
      usr: path.resolve("src/usr"),
      mgr: path.resolve("src/mgr"),
    },
  },
  plugins: [
    new ESLintPlugin(),
    new HtmlWebpackPlugin({
      title: "SESS",
      template: "./public/index.html",
      favicon: "./public/favicon/favicon.svg",
    }),
    new webpack.DefinePlugin({
      "process.env.PUBLIC_URL": JSON.stringify("./public/"),
    }),
    new CleanWebpackPlugin(),
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
  ],
  performance: {
    hints: false,
  },
};
