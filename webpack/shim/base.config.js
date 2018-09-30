const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/shim/index.js',
  output: {
    filename: 'shim.js',
    path: path.resolve(__dirname, '..', '..', 'dist')
  },
  devServer: {
    contentBase: path.join(__dirname, '..', '..', 'dist'),
    compress: true,
    inline: true,
    port: 9000,
    index: path.join(__dirname, '..', '..', 'dist', 'index-shim.html'),
  },
  devtool: 'eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      ENVIRONMENT: JSON.stringify(process.env.NODE_ENV),
    })
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: path.join(__dirname, '..', '..', 'src'),
        exclude: /(node_modules)/,
        loader: require.resolve('babel-loader'),
        options: {
          cacheDirectory: true,
        },
      },
      {
        test: /\.(scss|sass)$/,
        use: [{
            loader: "style-loader"
        }, {
            loader: "css-loader"
        }]
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              disable: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [{
            loader: "style-loader"
        }, {
            loader: "css-loader"
        }]
      }
    ]
  },
  resolve: {
    alias: {
      'shared': path.resolve(__dirname, '..', '..', `src/shared`),
    }
  }
};