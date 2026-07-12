const Ajv = require('ajv')
const ajv = new Ajv({ schemaId: 'auto' })

module.exports = (app) => {
    return async (ctx, next) => {
        if (ctx.path.indexOf('/api') < 0) {
            return await next()
        }

        const { body, query, headers } = ctx.request
        const { path, method } = ctx

        app.logger.info(`[${method} ${path}] query: ${JSON.stringify(query)}`)

        const scheme = app.routerSchema[path]?.[method.toLowerCase()]

        if (!scheme) {
            return await next()
        }

        let valid = true
        let validate

        if (valid && scheme.headers) {
            validate = ajv.compile(scheme.headers)
            valid = validate(headers)
        }

        if (valid && scheme.body) {
            validate = ajv.compile(scheme.body)
            valid = validate(body)
        }

        if (valid && scheme.query) {
            validate = ajv.compile(scheme.query)
            valid = validate(query)
        }

        if (!valid) {
            ctx.status = 200
            ctx.body = {
                success: false,
                message: `参数校验失败: ${validate.errors.map(e => e.message).join(', ')}`,
                code: 442
            }
            return
        }

        await next()
    }
}
