/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

const webpack = require("webpack");
const dotenv = require("dotenv").config({ path: `${__dirname}/.env` });
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const path = require("path");
const yaml = require("js-yaml");
const fs = require("fs");
let mode = 'development';

const yamlConfigToAppConfig = (offline, configPath) => {
  const file = fs.readFileSync(
      configPath || path.join(__dirname, "..", "config.yml"),
      "utf-8"
  );

  const yamlConfig = yaml.load(file);

  return {
    APP_ENV: yamlConfig.appEnv,
    SERVER_OFFLINE: offline,
    SERVER_BASE_PATH: yamlConfig.externalEndpoint,
  };
};

function envToAppConfig() {
  return {
    APP_ENV: process.env.APP_ENV,
    SERVER_OFFLINE: process.env.SERVER_OFFLINE,
    SERVER_BASE_PATH: process.env.SERVER_BASE_PATH
        ? process.env.SERVER_BASE_PATH
        : "",
    API_PATH: process.env.API_VERSION,
    MODULE_KEY: process.env.MODULE_KEY,
    RELEASE_TAG: process.env.RELEASE_TAG,
    COMMIT: process.env.COMMIT
  };
}

module.exports = (env, args) => {
  return {
    mode: mode,
    devServer: {
      port: 8084,
    },
    resolve: {
      extensions: [".ts", ".tsx", ".jsx", ".js", ".json"],
    },
    module: {
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
    },

    plugins: [
      new ModuleFederationPlugin({
        name: "FuryApplicationStatusPageUI",
        library: { type: "var", name: "FuryApplicationStatusPageUI" },
        filename: "remoteEntry.js",
        exposes: {
          "./FuryApplicationStatusPage": "./src/webcomponents/FuryApplicationStatusPage.tsx",
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
        filename: "index.htm"
      }),
      new webpack.DefinePlugin({
        "process.env": JSON.stringify({
          ...(dotenv.parsed ? dotenv.parsed : {}),
          ...(env.from_yaml
              ? yamlConfigToAppConfig(env.offline, env.config_path)
              : envToAppConfig()),
        }),
      }),
    ],
  };
};
