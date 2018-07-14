const path =require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin')
let pathsToClean = [
  'dist'
]


module.exports ={
   entry :'./src/index.js',
   output: {
      path :path.join(__dirname,"dist"),
      filename:"index_bundle.js"
   },
   plugins:[
      new CleanWebpackPlugin(pathsToClean),
      new HtmlWebpackPlugin({
        template: './src/index.html'
      }),
      new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename:'[name].css',
       chunkFilename: '[id].css',
    })
   ],
   module:{
      rules:[
        {
         test: /\.(png|jpg|gif)$/,
         use: [
           {
             loader: 'file-loader',
             options: {
               name: '[name].[ext]',
               outputPath: 'images/'
             }
           }
         ]
       },
        {
            test: /\.sass$/,
            use: [
                MiniCssExtractPlugin.loader,
                "css-loader", // translates CSS into CommonJS
                "sass-loader" // compiles Sass to CSS
            ]
        },
        {
          test:/\.js$/,
          exclude: /node_modules/,
          use:{
             loader:'babel-loader'
          }
        }
      ]
   }
}
