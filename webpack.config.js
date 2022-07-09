module.exports = {
    renderer: {
        entry: "./src/renderer/javascripts/index.js",
        module: {
            rules: [
                {
                    test: /\.(js)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/react", "@babel/preset-env"],
                        },
                    },
                },
                {
                    test: /\.(?:|gif|png|jpg|svg)$/,
                    type: "asset/resource",
                    // loader: 'file-loader',
                    // options: {
                    //   name: '[path][name].[hash].[ext]',
                    // },
                },
                {
                    test: /\.(ttf)$/,
                    loader: "file-loader",
                    options: {
                        name: "[path][name].[hash].[ext]",
                    },
                },
                {
                    test: /\.(mp3)$/,
                    loader: "file-loader",
                    options: {
                        name: "[path][name].[hash].[ext]",
                    },
                },
            ],
        },
    },
    preload: {
        entry: "./src/preload/index.js",
    },
    main: {
        entry: "./src/main/index.js",
    },
};
