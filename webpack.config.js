const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './src/index.ts',
    mode: "development",
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /resources/,
                loader: 'file-loader',
                options: {
                    name: 'resources',
                },
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            title: 'SoftGame'
        }),
        new webpack.ProvidePlugin({
            PIXI: 'pixi.js'
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: './resources/',
                    to: './resources'
                }
            ],
        }),
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 7777
    },
    watch: false,
    watchOptions: {
        aggregateTimeout: 1000,
        poll: true
    },
};
