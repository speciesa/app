const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Удаляем wasm из sourceExts (чтобы не было SyntaxError)
config.resolver.sourceExts = config.resolver.sourceExts.filter(ext => ext !== 'wasm');

// Добавляем wasm в assetExts (чтобы файл просто загружался как бинарник)
config.resolver.assetExts.push('wasm');

module.exports = config;