const path = require("path");

const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = [
  {
    mode: "development",
    context: __dirname,
    entry: {
      app: "./src/index.js",
    },
    devtool: "eval-source-map",
    resolve: {
      mainFields: ["module", "main"],
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(png|gif|jpg|jpeg|svg|xml|json)$/,
          use: ["url-loader"],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "src/index.html",
      }),
    ],

    // development server options
    devServer: {
      contentBase: path.join(__dirname, "dist"),
    },
  },
];
