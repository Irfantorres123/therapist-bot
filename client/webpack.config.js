const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const CompressionPlugin = require("compression-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
module.exports = {
  mode: "production",
  entry: { main: path.join(__dirname, "./src/index.js") },
  output: {
    publicPath: "/public/",
    path: path.join(__dirname, "./build"),
    filename: "[name].bundle.js",
  },
  resolve: {
    extensions: [".js", ".jsx"],
    fallback: {
      crypto: false,
      util: require.resolve("util/"),
      stream: require.resolve("stream-browserify"),
      buffer: require.resolve("buffer/"),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(jpg|png|svg|gif|json)$/,
        type: "asset",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "index.html",
      favicon: "./public/favicon.ico",
    }),
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
    new webpack.DefinePlugin({
      // This has effect on the react lib size
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new CompressionPlugin({
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0,
    }),
    new WebpackManifestPlugin({
      fileName: "manifest.json",
      seed: {
        name: "Therapy Sense",
        short_name: "Therapy Sense",
        start_url: "/",
        background_color: "#ffffff",
        theme_color: "#ffffff",
        display: "standalone",
        icons: [
          {
            src: "/public/favicon.ico",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/public/favicon.ico",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  optimization: {
    minimize: true,

    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          ecma: 6,
          mangle: true,

          output: {
            comments: false,
            beautify: false,
            indent_level: 2,
          },
        },
      }),
    ],
  },
  devServer: {
    static: "./build",
    watchFiles: "./src/**/*.js",
    proxy: {
      "/api": {
        target: "http://localhost:8080",
      },
    },
    historyApiFallback: true,
  },
};
