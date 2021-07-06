/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const generateProcessEnv = require("./generateProcessEnv");

function getPlugins(dotenv, env) {
  return [
    new ModuleFederationPlugin({
      name: "FuryApplicationStatusPageUI",
      library: { type: "var", name: "FuryApplicationStatusPageUI" },
      filename: "remoteEntry.js",
      exposes: {
        "./ApplicationStatusPage":
          "./src/webcomponents/ApplicationStatusPage.tsx",
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: ">=16.8.0",
        },
        "react-dom": {
          singleton: true,
        },
        "fury-design-system": {
          singleton: true,
          requiredVersion: ">=0.0.3",
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.htm",
      favicon: "./public/favicon.ico",
      manifest: "./public/manifest.json",
    }),
    new webpack.DefinePlugin({
      "process.env": generateProcessEnv(dotenv, env),
    }),
  ];
}

function getModule() {
  return {
    rules: [
      {
        test: /\.tsx?/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /bootstrap\.js$/,
        loader: "bundle-loader",
        options: {
          lazy: true,
        },
      },
      {
        test: /\.m?js$/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        /* The following line to ask babel
              to compile any file with extension .js */
        test: /\.(js|jsx)?$/,
        /* exclude node_modules directory from babel.
              Babel will not compile any files in this directory */
        exclude: /node_modules/,
        // To Use babel Loader
        loader: "babel-loader",
        options: {
          presets: [
            "@babel/preset-env" /* to transfer any advansed ES to ES5 */,
            "@babel/preset-react",
          ], // to compile react to ES5
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
        exclude: /node_modules/,
        use: ["file-loader?name=[name].[ext]"],
      },
    ],
  };
}

function generateBaseWebpackConfig(env, mode, dotenv, args) {
  return {
    mode: mode,
    resolve: {
      extensions: [".ts", ".tsx", ".jsx", ".js", ".json"],
    },
    module: getModule(),
    plugins: getPlugins(dotenv, env),
  };
}

module.exports = generateBaseWebpackConfig;
