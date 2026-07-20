/**
 * 运行时异常错误处理， 兜底所有异常
 * @param {object} app Koa 实例
 */

module.exports = (app) => {
    return async (ctx, next) => {
        try {
            await next();
        } catch (e) {
            // 异常处理
            const err = e || {}
            const { status, message, detail } = err
            // 防止循环引用导致 JSON.stringify 抛出异常
            try {
                app.logger.info(JSON.stringify(e))
            } catch (jsonErr) {
                app.logger.info('[unserializable error]')
            }
            app.logger.error('[-- exception --]', e)
            app.logger.error('[-- exception --]', status, message, detail)

            if (message && message.indexOf('template not found') > -1) {
                ctx.status = 302
                ctx.redirect(`${app.options?.homePath || '/'}`)
                return
            }

            const resBody = {
                success: false,
                message: '网络异常，请稍后重试',
                code: 50000,
            }
            ctx.status = 200
            ctx.body = resBody
        }
    }

}