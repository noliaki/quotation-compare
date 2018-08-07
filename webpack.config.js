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
  entry: './vue/Entry.ts',
  output: {
    path: path.resolve('docs/vue/js'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js', '.ts', '.vue']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          configFile: path.resolve('tsconfig-vue.json'),
          appendTsSuffixTo: [/\.vue$/]
        }
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
  entry: './react/Entry.tsx',
  output: {
    path: path.resolve('docs/react/js'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          configFile: path.resolve('tsconfig-react.json')
        }
      },
      {
        test: /\.css$/,
        loader: 'css-loader',
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

module.exports = [reactConfig]
