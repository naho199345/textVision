const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const RefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  plugins: [new RefreshWebpackPlugin()],
});
