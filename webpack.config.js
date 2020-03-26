const path = require('path')
const glob = require('glob')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const PurgecssPlugin = require('purgecss-webpack-plugin')

class CustomExtractor {
    static extract(content) {
        return content.match(/[A-z0-9-:/]+/g)
    }
}

const PATHS = {
    src: path.join(__dirname, 'public2')
}

module.exports = {
    output: {path: path.resolve(__dirname, 'dist'),
        publicPath: './dist'
    },
    devServer: {
        contentBase: './dist',
    },
    entry: './routes/index.js',
    externals: {
        fsevents: "require('fsevents')",
        pg: "require('pg')",
        fs: "require('fs')",
        express: "require('express')"
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true
                },
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all',
                },
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader?sourceMap"
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader',
                ],
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                loader: 'file-loader',
                options: {
                    name: '[directory][name].[ext]',
                },
            },
            { test: /\.html$/, loader: 'html-loader' }
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css"
        }),
        new PurgecssPlugin({
            paths: glob.sync(`${PATHS.src}/*`, { nodir: true }),
            styleExtensions: ['.css'],
            whitelist: ['whitelisted'],
            extractors: [
                {
                    extractor: CustomExtractor,
                    extensions: ['html', 'js']
                }
            ]
        })
    ]
}