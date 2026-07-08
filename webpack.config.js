const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.css$/,
    use: [MiniCssExtractPlugin.loader, 'css-loader'],
  });
  config.plugins.push(new MiniCssExtractPlugin({ filename: 'index.css' }));

  config.module.rules.push({
    test: /\.(png|jpe?g|gif|svg)$/i,
    type: 'asset/resource',
    generator: { filename: 'images/[name][ext]' },
  });

  return config;
};
