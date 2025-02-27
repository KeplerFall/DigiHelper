import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import path from 'path';

export default {
  mode: 'production',
  entry: {
    contentScript: './src/content/index.js',
    background: './src/background/index.js',
    react: './src/react/index.jsx'
  },
  output: {
    path: path.resolve('dist'),
    filename: '[name].js',
    clean: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve('src/global.css'),
          to: path.resolve('dist')
        },{
        from: path.resolve('manifest.json'),
        to: path.resolve('dist')
      },
      {
        from: path.resolve('src/tailwind.js'),
        to: path.resolve('dist')
      },
      {
        from: path.resolve('src/assets/fonts/PixelDigivolve.otf'),
        to: path.resolve('dist')
      },
    {
      from: path.resolve('icon.png'),
      to: path.resolve('dist')
    }]
    })
  ],
  module: {
    rules: [
      {
        test: /.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', {'runtime': 'automatic'}]
            ]
          }
        }
      },
      {
        test: /\.(woff(2)?|ttf|eot|otf|svg)$/, // Tipos de arquivos de fonte
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name][ext]', // Caminho de saída das fontes
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
};