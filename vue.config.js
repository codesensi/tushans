const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    lintOnSave: false,
    publicPath: '/templates/tushans',
    outputDir: 'tushans',
    devServer: {
        proxy: {
            '/index.php': {
                target: 'https://web.png.ink',
                pathRewrite: { '^/index.php': '/index.php' },
                changeOrigin: true, // target是域名的话，需要这个参数，
                secure: false, // 设置支持https协议的代理
            },
        }
    }
})