const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
    resolver: {
        blacklistRE: exclusionList([
            // Ignore specific folders (add any additional folders as needed)
            /node_modules\/.*\/node_modules\/react-native\/.*/,
            /\.git\/.*/, // Ignore git files
            /\.expo\/.*/, // Ignore expo files (if applicable)
        ]),
    },
    watchFolders: [
        // Specify the root folder to reduce file-watching overhead
        __dirname,
    ],
    server: {
        // Increase the timeout for file-watching
        enhanceMiddleware: (middleware, server) => {
            server.keepAliveTimeout = 30000; // 30 seconds
            return middleware;
        },
    },
    transformer: {
        // Optimize file transformation
        minifierPath: 'metro-minify-terser',
    },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
