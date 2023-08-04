const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
//스타일 코드를 청크(Chunk)에서 파일로 추출하므로 개발 중에는 플러그인을 사용하지 않는 것이 좋습니다.
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = merge(common, {
  mode: "production",
  devtool: "source-map",
  plugins: [
    // 컴파일 + 번들링 CSS 파일이 저장될 경로와 이름 지정
    new MiniCssExtractPlugin({
      filename: "[name].css", //: "[name].[hash].css",
    }),
  ],
});
