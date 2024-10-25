//@ts-check
'use strict';

const path = require('path');

/** @type {import('webpack').Configuration} */
const config = {
    target: 'node',

    entry: './extension/src/extension.ts',
    output: {
        path: path.resolve(__dirname, 'extension', 'pack'),
        filename: 'extension.js',
        library: {
            type: 'commonjs2'
        },
        devtoolModuleFilenameTemplate: info => {
            return `webpack:///${info.resourcePath.replace(/^\.\.\//, '')}`;
        },
    },
    devtool: 'source-map',
    externals: {
        vscode: 'commonjs vscode'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: 'ts-loader'
            }
        ]
    },
    optimization: {
        // Add any optimization options here if needed
    },
    performance: {
        hints: false
    },
    node: {
        __dirname: false,
        __filename: false,
        global: true,
    }
};

module.exports = config;
