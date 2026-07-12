const md5 = require('md5')

/**
 * API 签名合法性校验
 * @param {object} app Koa 实例
 */
module.exports = (app) => {
    return async (ctx, next) => {
        // 只对 API 请求做签名校验
        if (ctx.path.indexOf('/api') < 0) {
            return await next()            
        }

        const { path, method } = ctx
        const { headers } = ctx.request
        const { s_sign: sSign, s_t: st } = headers

        const signKey = 'klklfadfkj1341adjoiwejhwqhghj123'
        const signature = md5(`${signKey}_${st}`)
        app.logger.info(`[$method] ${path} signature: ${signature}`)

        if (!sSign || !st || signature !== sSign.toLowerCase() || Date.now() - st > 600000) {
            ctx.status = 200
            ctx.body = {
                success: false,
                message: '签名校验失败',
                code: 445
            }
            return
        }

        await next()
    }
}