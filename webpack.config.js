const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const HtmlBeautifyPlugin = require('html-beautify-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin({
            protectWebpackAssets: false,
            cleanAfterEveryBuildPatterns: ['**/*', '!index.html']
        }),
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({ template: 'src/index.html', inlineSource: '.(js|css)$' }),
        new HtmlWebpackInlineSourcePlugin(),
        new HtmlBeautifyPlugin({
            config: {
                html: {
                    "end_with_newline ": false,
                    unformatted: ['script']
                }
            }
        })
    ]
};