const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    mode: "production",
    entry: {
        app: './app.js'
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: "app.bundle.js"
    },
    externals: [nodeExternals()],
    module: {
        rules: [{
            test: /\.js?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            use: {
                presets: ['env']
            }
        }]
    }
};
