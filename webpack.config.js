const webpack = require('webpack')
const path = require('path')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  })
]

const VueLoaderPlugin = require('vue-loader/lib/plugin')

const vueConfig = {
  mode: process.env.NODE_ENV,
  context: path.resolve('src'),
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        uglifyOptions: {
          compress: {
            drop_console: process.env.NODE_ENV === 'production'
          }
        }
      })
    ]
  },
  entry: './vue/Entry.js',
  output: {
    path: path.resolve('docs/vue/js'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js', '.vue']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins: plugins.concat([
    new VueLoaderPlugin()
  ])
}

const reactConfig = {
  mode: process.env.NODE_ENV,
  context: path.resolve('src'),
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        uglifyOptions: {
          compress: {
            drop_console: process.env.NODE_ENV === 'production'
          }
        }
      })
    ]
  },
  entry: './react/Entry.jsx',
  output: {
    path: path.resolve('docs/react/js'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.jsx', '.js']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader?modules'],
        exclude: /node_modules/
      }
    ]
  },
  plugins
}

if (process.env.NODE_ENV === 'development') {
  vueConfig.watch = reactConfig.watch = true
  vueConfig.cache = reactConfig.cache = true

  vueConfig.plugins = vueConfig.plugins.concat([
    new webpack.LoaderOptionsPlugin({
      debug: true
    })
  ])

  reactConfig.plugins = reactConfig.plugins.concat([
    new webpack.LoaderOptionsPlugin({
      debug: true
    })
  ])
}

module.exports = [vueConfig, reactConfig]
