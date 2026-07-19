const errorHandler = require('../../../app/middleware/error-handler')

describe('error-handler middleware', () => {
    let middleware
    let mockApp
    let mockCtx
    let mockNext

    beforeEach(() => {
        mockApp = {
            logger: {
                info: jest.fn(),
                error: jest.fn()
            },
            options: {}
        }
        middleware = errorHandler(mockApp)
        
        mockCtx = {
            status: 200,
            body: {},
            redirect: jest.fn()
        }
        
        mockNext = jest.fn()
    })

    describe('normal flow', () => {
        it('should pass through when no error occurs', async () => {
            mockNext.mockResolvedValue()
            
            await middleware(mockCtx, mockNext)
            
            expect(mockNext).toHaveBeenCalledTimes(1)
            expect(mockApp.logger.error).not.toHaveBeenCalled()
            expect(mockCtx.body).toEqual({})
        })

        it('should handle successful next without modifying context', async () => {
            mockCtx.body = { success: true, data: 'test' }
            mockNext.mockResolvedValue()
            
            await middleware(mockCtx, mockNext)
            
            expect(mockCtx.body).toEqual({ success: true, data: 'test' })
        })
    })

    describe('error handling', () => {
        it('should catch and handle general errors', async () => {
            const testError = new Error('Something went wrong')
            mockNext.mockRejectedValue(testError)
            
            await middleware(mockCtx, mockNext)
            
            expect(mockApp.logger.info).toHaveBeenCalled()
            expect(mockApp.logger.error).toHaveBeenCalled()
            expect(mockCtx.status).toBe(200)
            expect(mockCtx.body.success).toBe(false)
            expect(mockCtx.body.code).toBe(50000)
            expect(mockCtx.body.message).toBe('网络异常，请稍后重试')
        })

        it('should handle errors with status and message', async () => {
            const testError = {
                status: 404,
                message: 'Resource not found',
                detail: 'The requested resource does not exist'
            }
            mockNext.mockRejectedValue(testError)
            
            await middleware(mockCtx, mockNext)
            
            expect(mockApp.logger.error).toHaveBeenCalled()
            expect(mockCtx.status).toBe(200)
            expect(mockCtx.body.success).toBe(false)
        })

        it('should handle errors with only message', async () => {
            const testError = {
                message: 'Validation failed'
            }
            mockNext.mockRejectedValue(testError)
            
            await middleware(mockCtx, mockNext)
            
            expect(mockApp.logger.error).toHaveBeenCalled()
            expect(mockCtx.body.success).toBe(false)
        })

        it('should handle errors without any properties', async () => {
            const testError = {}
            mockNext.mockRejectedValue(testError)
            
            await middleware(mockCtx, mockNext)
            
            expect(mockApp.logger.error).toHaveBeenCalled()
            expect(mockCtx.body.success).toBe(false)
        })

        it('should handle string errors', async () => {
            mockNext.mockRejectedValue('String error')
            
            await middleware(mockCtx, mockNext)
            
            expect(mockApp.logger.error).toHaveBeenCalled()
            expect(mockCtx.body.success).toBe(false)
        })
    })

    describe('template not found error', () => {
        it('should redirect when template not found', async () => {
            const testError = new Error('template not found: page.html')
            mockApp.options = { homePath: '/home' }
            mockNext.mockRejectedValue(testError)
            
            await middleware(mockCtx, mockNext)
            
            expect(mockCtx.status).toBe(302)
            expect(mockCtx.redirect).toHaveBeenCalledWith('/home')
        })

        it('should redirect to root when homePath is not set', async () => {
            const testError = new Error('template not found')
            mockApp.options = {}
            mockNext.mockRejectedValue(testError)
            
            await middleware(mockCtx, mockNext)
            
            expect(mockCtx.status).toBe(302)
            expect(mockCtx.redirect).toHaveBeenCalledWith('/')
        })

        it('should not redirect for other errors', async () => {
            const testError = new Error('database connection failed')
            mockNext.mockRejectedValue(testError)
            
            await middleware(mockCtx, mockNext)
            
            expect(mockCtx.redirect).not.toHaveBeenCalled()
            expect(mockCtx.status).toBe(200)
        })
    })

    describe('edge cases', () => {
        it('should handle null error', async () => {
            mockNext.mockRejectedValue(null)
            
            await middleware(mockCtx, mockNext)
            
            expect(mockApp.logger.error).toHaveBeenCalled()
            expect(mockCtx.body.success).toBe(false)
        })

        it('should handle undefined error', async () => {
            mockNext.mockRejectedValue(undefined)
            
            await middleware(mockCtx, mockNext)
            
            expect(mockApp.logger.error).toHaveBeenCalled()
            expect(mockCtx.body.success).toBe(false)
        })

        it('should handle error with stack trace', async () => {
            try {
                throw new Error('Test error with stack')
            } catch (e) {
                mockNext.mockRejectedValue(e)
                
                await middleware(mockCtx, mockNext)
                
                expect(mockApp.logger.error).toHaveBeenCalled()
                expect(mockCtx.body.success).toBe(false)
            }
        })

        it('should log error details', async () => {
            const testError = {
                status: 500,
                message: 'Internal server error',
                detail: 'Database timeout'
            }
            mockNext.mockRejectedValue(testError)
            
            await middleware(mockCtx, mockNext)
            
            expect(mockApp.logger.error).toHaveBeenCalledWith('[-- exception --]', testError)
            expect(mockApp.logger.error).toHaveBeenCalledWith('[-- exception --]', 500, 'Internal server error', 'Database timeout')
        })
    })
})