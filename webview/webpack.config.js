// @ts-check
const path = require('path');

/**@type {import('webpack').Configuration}*/
const config = {
    entry: './src/main.ts',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'pack')
    },
    target: 'web',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: ['ts-loader']
            },
            {
                test: /\.js$/,
                use: ['source-map-loader'],
                enforce: 'pre'
            },
            {
                test: /\.css$/,
                exclude: /\.useable\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.ttf$/,
                use: ['file-loader'],
            }
        ]
    },
    devtool: 'eval-source-map',
    resolve: {
        fallback: {
            fs: false,
            child_process: false,
            net: false,
            crypto: false
        }
    }
};

module.exports = config;
