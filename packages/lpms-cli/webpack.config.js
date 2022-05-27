/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

const baseConfig = {
  mode: 'production',
  entry: './src/index.ts',
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: "#!/usr/bin/env -S node --no-deprecation",
      raw: true
    }),
  ],
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.tsx?$/, loader: 'ts-loader' }
    ]
    // rules: [
    //   {
    //     test: /\.(ts|js)?$/,
    //     exclude: /node_modules/,
    //     use: {
    //       loader: "babel-loader",
    //       options: {
    //         presets: [
    //           "@babel/preset-typescript",
    //         ],
    //       },
    //     },
    //   },
    // ]
  }
};

module.exports = {
  ...baseConfig,
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      type: 'commonjs'
    },
  },
  target: 'node',
  externalsPresets: { node: true },
  externals: [
    nodeExternals({
      allowlist: ['node-fetch']
    })
  ],
};
