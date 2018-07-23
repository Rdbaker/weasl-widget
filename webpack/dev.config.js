const path = require('path');

const paths = {
  appSrc: 'src',
}

module.exports = {
  entry: './src/shim/index.js',
  output: {
    filename: 'shim.js',
    path: path.resolve(__dirname, '..', 'dist')
  },
  devServer: {
    contentBase: path.join(__dirname, '..', 'dist'),
    compress: true,
    inline: true,
    port: 9000,
  },
  devtool: 'eval-source-map',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: path.join(__dirname, '..', 'src'),
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
      'actions': path.resolve(__dirname, '..', `${paths.appSrc}/actions`),
      'api': path.resolve(__dirname, '..', `${paths.appSrc}/api`),
      'audio': path.resolve(__dirname, '..', `${paths.appSrc}/audio`),
      'components': path.resolve(__dirname, '..', `${paths.appSrc}/components`),
      'config': path.resolve(__dirname, '..', `${paths.appSrc}/config`),
      'constants': path.resolve(__dirname, '..', `${paths.appSrc}/constants`),
      'containers': path.resolve(__dirname, '..', `${paths.appSrc}/containers`),
      'images': path.resolve(__dirname, '..', `${paths.appSrc}/images`),
      'modules': path.resolve(__dirname, '..', `${paths.appSrc}/modules`),
      'utils': path.resolve(__dirname, '..', `${paths.appSrc}/utils`),
    }
  }
};