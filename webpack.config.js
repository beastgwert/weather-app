const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/modules/index.js',
    //multiple entry points not necessary
  },
  // debugging
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
  },
  // npm install --save-dev html-webpack-plugin
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Development',
      template: "./src/template.html",
    }),
  ],
  module: {
    rules: [
      {
        // npm install --save-dev style-loader css-loader
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/[name][ext]",
        },
      },
    ],
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
};