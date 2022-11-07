module.exports = {
    renderer: {
        entry: {
            index: "./src/renderer/javascripts/index.js",
            generate: "./src/renderer/generate/index.js",
        },
        output: {
            filename: "[name].js",
        },
        module: {
            rules: [
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                      "style-loader",
                      "css-loader",
                      "sass-loader",
                    ],
                },
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
                    test: /\.(?:|ico|gif|png|jpg|svg)$/,
                    type: "asset/resource",
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
