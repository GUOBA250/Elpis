const apiSignVerify = require('../../../app/middleware/api-sign-verify')
const md5 = require('md5')

describe('api-sign-verify middleware', () => {
    let middleware
    let mockApp
    let mockCtx
    let mockNext

    beforeEach(() => {
        mockApp = {
            logger: {
                info: jest.fn()
            }
        }
        middleware = apiSignVerify(mockApp)
        
        mockCtx = {
            path: '/api/test',
            method: 'GET',
            request: {
                headers: {}
            },
            status: 200,
            body: {}
        }
        
        mockNext = jest.fn().mockResolvedValue()
    })

    describe('non-API paths', () => {
        it('should skip verification for non-API paths', async () => {
            mockCtx.path = '/view/home'
            
            await middleware(mockCtx, mockNext)
            
            expect(mockNext).toHaveBeenCalledTimes(1)
            expect(mockApp.logger.info).not.toHaveBeenCalled()
        })

        it('should skip verification for static assets', async () => {
            mockCtx.path = '/static/js/app.js'
            
            await middleware(mockCtx, mockNext)
            
            expect(mockNext).toHaveBeenCalledTimes(1)
        })
    })

    describe('API paths with valid signature', () => {
        it('should pass when signature is valid', async () => {
            const st = Date.now().toString()
            const signKey = 'klklfadfkj1341adjoiwejhwqhghj123'
            const sSign = md5(`${signKey}_${st}`)
            
            mockCtx.path = '/api/test'
            mockCtx.method = 'GET'
            mockCtx.request.headers = { s_sign: sSign, s_t: st }
            
            await middleware(mockCtx, mockNext)
            
            expect(mockNext).toHaveBeenCalledTimes(1)
            expect(mockApp.logger.info).toHaveBeenCalled()
        })

        it('should handle signature in lowercase', async () => {
            const st = Date.now().toString()
            const signKey = 'klklfadfkj1341adjoiwejhwqhghj123'
            const sSign = md5(`${signKey}_${st}`).toUpperCase()
            
            mockCtx.path = '/api/test'
            mockCtx.method = 'POST'
            mockCtx.request.headers = { s_sign: sSign, s_t: st }
            
            await middleware(mockCtx, mockNext)
            
            expect(mockNext).toHaveBeenCalledTimes(1)
        })
    })

    describe('API paths with invalid signature', () => {
        it('should fail when s_sign is missing', async () => {
            const st = Date.now().toString()
            
            mockCtx.path = '/api/test'
            mockCtx.method = 'GET'
            mockCtx.request.headers = { s_t: st }
            
            await middleware(mockCtx, mockNext)
            
            expect(mockNext).not.toHaveBeenCalled()
            expect(mockCtx.body.success).toBe(false)
            expect(mockCtx.body.code).toBe(445)
            expect(mockCtx.body.message).toBe('签名校验失败')
        })

        it('should fail when s_t is missing', async () => {
            const st = Date.now().toString()
            const signKey = 'klklfadfkj1341adjoiwejhwqhghj123'
            const sSign = md5(`${signKey}_${st}`)
            
            mockCtx.path = '/api/test'
            mockCtx.method = 'GET'
            mockCtx.request.headers = { s_sign: sSign }
            
            await middleware(mockCtx, mockNext)
            
            expect(mockNext).not.toHaveBeenCalled()
            expect(mockCtx.body.code).toBe(445)
        })

        it('should fail when signature is incorrect', async () => {
            const st = Date.now().toString()
            
            mockCtx.path = '/api/test'
            mockCtx.method = 'GET'
            mockCtx.request.headers = { s_sign: 'wrong-signature', s_t: st }
            
            await middleware(mockCtx, mockNext)
            
            expect(mockNext).not.toHaveBeenCalled()
            expect(mockCtx.body.code).toBe(445)
        })

        it('should fail when timestamp is expired', async () => {
            const st = (Date.now() - 700000).toString()
            const signKey = 'klklfadfkj1341adjoiwejhwqhghj123'
            const sSign = md5(`${signKey}_${st}`)
            
            mockCtx.path = '/api/test'
            mockCtx.method = 'GET'
            mockCtx.request.headers = { s_sign: sSign, s_t: st }
            
            await middleware(mockCtx, mockNext)
            
            expect(mockNext).not.toHaveBeenCalled()
            expect(mockCtx.body.code).toBe(445)
        })

        it('should pass when timestamp is in the future within valid range', async () => {
            const st = (Date.now() + 10000).toString()
            const signKey = 'klklfadfkj1341adjoiwejhwqhghj123'
            const sSign = md5(`${signKey}_${st}`)
            
            mockCtx.path = '/api/test'
            mockCtx.method = 'GET'
            mockCtx.request.headers = { s_sign: sSign, s_t: st }
            
            await middleware(mockCtx, mockNext)
            
            expect(mockNext).toHaveBeenCalledTimes(1)
        })
    })

    describe('edge cases', () => {
        it('should handle empty headers', async () => {
            mockCtx.path = '/api/test'
            mockCtx.method = 'GET'
            mockCtx.request.headers = {}
            
            await middleware(mockCtx, mockNext)
            
            expect(mockNext).not.toHaveBeenCalled()
            expect(mockCtx.body.code).toBe(445)
        })

        it('should handle non-numeric timestamp', async () => {
            mockCtx.path = '/api/test'
            mockCtx.method = 'GET'
            mockCtx.request.headers = { s_sign: 'some-sign', s_t: 'not-a-number' }
            
            await middleware(mockCtx, mockNext)
            
            expect(mockNext).not.toHaveBeenCalled()
            expect(mockCtx.body.code).toBe(445)
        })

        it('should handle zero timestamp', async () => {
            const signKey = 'klklfadfkj1341adjoiwejhwqhghj123'
            const sSign = md5(`${signKey}_0`)
            
            mockCtx.path = '/api/test'
            mockCtx.method = 'GET'
            mockCtx.request.headers = { s_sign: sSign, s_t: '0' }
            
            await middleware(mockCtx, mockNext)
            
            expect(mockNext).not.toHaveBeenCalled()
            expect(mockCtx.body.code).toBe(445)
        })

        it('should log signature information', async () => {
            const st = Date.now().toString()
            const signKey = 'klklfadfkj1341adjoiwejhwqhghj123'
            const sSign = md5(`${signKey}_${st}`)
            
            mockCtx.path = '/api/test'
            mockCtx.method = 'GET'
            mockCtx.request.headers = { s_sign: sSign, s_t: st }
            
            await middleware(mockCtx, mockNext)
            
            expect(mockApp.logger.info).toHaveBeenCalledWith(expect.stringContaining('signature'))
        })
    })
})