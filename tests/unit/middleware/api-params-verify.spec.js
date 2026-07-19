const apiParamsVerify = require('../../../app/middleware/api-params-verify')

describe('api-params-verify middleware', () => {
    let middleware
    let mockApp
    let mockCtx
    let mockNext

    beforeEach(() => {
        mockApp = {
            logger: {
                info: jest.fn()
            },
            routerSchema: {}
        }
        middleware = apiParamsVerify(mockApp)
        
        mockCtx = {
            path: '/api/test',
            method: 'GET',
            request: {
                body: {},
                query: {},
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

        it('should skip verification for paths without /api', async () => {
            mockCtx.path = '/static/css/style.css'
            
            await middleware(mockCtx, mockNext)
            
            expect(mockNext).toHaveBeenCalledTimes(1)
        })
    })

    describe('API paths without schema', () => {
        it('should skip verification when no schema exists for path', async () => {
            mockCtx.path = '/api/test'
            mockCtx.method = 'GET'
            
            await middleware(mockCtx, mockNext)
            
            expect(mockNext).toHaveBeenCalledTimes(1)
            expect(mockApp.logger.info).toHaveBeenCalled()
        })

        it('should skip verification when no schema exists for method', async () => {
            mockApp.routerSchema = {
                '/api/test': {
                    post: { query: {} }
                }
            }
            mockCtx.path = '/api/test'
            mockCtx.method = 'GET'
            
            await middleware(mockCtx, mockNext)
            
            expect(mockNext).toHaveBeenCalledTimes(1)
        })
    })

    describe('API paths with schema', () => {
        it('should pass verification when query params are valid', async () => {
            mockApp.routerSchema = {
                '/api/test': {
                    get: {
                        query: {
                            type: 'object',
                            properties: {
                                id: { type: 'number' },
                                name: { type: 'string' }
                            }
                        }
                    }
                }
            }
            mockCtx.path = '/api/test'
            mockCtx.method = 'GET'
            mockCtx.request.query = { id: 1, name: 'test' }
            
            await middleware(mockCtx, mockNext)
            
            expect(mockNext).toHaveBeenCalledTimes(1)
        })

        it('should pass verification when body params are valid', async () => {
            mockApp.routerSchema = {
                '/api/test': {
                    post: {
                        body: {
                            type: 'object',
                            properties: {
                                username: { type: 'string' },
                                password: { type: 'string' }
                            }
                        }
                    }
                }
            }
            mockCtx.path = '/api/test'
            mockCtx.method = 'POST'
            mockCtx.request.body = { username: 'user', password: 'pass' }
            
            await middleware(mockCtx, mockNext)
            
            expect(mockNext).toHaveBeenCalledTimes(1)
        })

        it('should pass verification when headers are valid', async () => {
            mockApp.routerSchema = {
                '/api/test': {
                    get: {
                        headers: {
                            type: 'object',
                            properties: {
                                'content-type': { type: 'string' }
                            }
                        }
                    }
                }
            }
            mockCtx.path = '/api/test'
            mockCtx.method = 'GET'
            mockCtx.request.headers = { 'content-type': 'application/json' }
            
            await middleware(mockCtx, mockNext)
            
            expect(mockNext).toHaveBeenCalledTimes(1)
        })

        it('should fail verification when query params are invalid', async () => {
            mockApp.routerSchema = {
                '/api/test': {
                    get: {
                        query: {
                            type: 'object',
                            properties: {
                                id: { type: 'number' }
                            }
                        }
                    }
                }
            }
            mockCtx.path = '/api/test'
            mockCtx.method = 'GET'
            mockCtx.request.query = { id: 'not-a-number' }
            
            await middleware(mockCtx, mockNext)
            
            expect(mockNext).not.toHaveBeenCalled()
            expect(mockCtx.status).toBe(200)
            expect(mockCtx.body.success).toBe(false)
            expect(mockCtx.body.code).toBe(442)
            expect(mockCtx.body.message).toContain('参数校验失败')
        })

        it('should fail verification when body params are invalid', async () => {
            mockApp.routerSchema = {
                '/api/test': {
                    post: {
                        body: {
                            type: 'object',
                            properties: {
                                age: { type: 'number' }
                            }
                        }
                    }
                }
            }
            mockCtx.path = '/api/test'
            mockCtx.method = 'POST'
            mockCtx.request.body = { age: 'twenty' }
            
            await middleware(mockCtx, mockNext)
            
            expect(mockNext).not.toHaveBeenCalled()
            expect(mockCtx.body.success).toBe(false)
            expect(mockCtx.body.code).toBe(442)
        })

        it('should fail verification when headers are invalid', async () => {
            mockApp.routerSchema = {
                '/api/test': {
                    get: {
                        headers: {
                            type: 'object',
                            properties: {
                                'authorization': { type: 'string' }
                            },
                            required: ['authorization']
                        }
                    }
                }
            }
            mockCtx.path = '/api/test'
            mockCtx.method = 'GET'
            mockCtx.request.headers = {}
            
            await middleware(mockCtx, mockNext)
            
            expect(mockNext).not.toHaveBeenCalled()
            expect(mockCtx.body.success).toBe(false)
            expect(mockCtx.body.code).toBe(442)
        })

        it('should validate query, body and headers in order', async () => {
            mockApp.routerSchema = {
                '/api/test': {
                    post: {
                        headers: {
                            type: 'object',
                            properties: {
                                'content-type': { type: 'string' }
                            }
                        },
                        body: {
                            type: 'object',
                            properties: {
                                name: { type: 'string' }
                            }
                        },
                        query: {
                            type: 'object',
                            properties: {
                                id: { type: 'number' }
                            }
                        }
                    }
                }
            }
            mockCtx.path = '/api/test'
            mockCtx.method = 'POST'
            mockCtx.request.headers = { 'content-type': 'application/json' }
            mockCtx.request.body = { name: 'test' }
            mockCtx.request.query = { id: 123 }
            
            await middleware(mockCtx, mockNext)
            
            expect(mockNext).toHaveBeenCalledTimes(1)
        })
    })

    describe('edge cases', () => {
        it('should handle empty schema', async () => {
            mockApp.routerSchema = {
                '/api/test': {
                    get: {}
                }
            }
            mockCtx.path = '/api/test'
            mockCtx.method = 'GET'
            
            await middleware(mockCtx, mockNext)
            
            expect(mockNext).toHaveBeenCalledTimes(1)
        })

        it('should handle null query params', async () => {
            mockApp.routerSchema = {
                '/api/test': {
                    get: {
                        query: {
                            type: 'object',
                            properties: {
                                name: { type: 'string' }
                            }
                        }
                    }
                }
            }
            mockCtx.path = '/api/test'
            mockCtx.method = 'GET'
            mockCtx.request.query = null
            
            await middleware(mockCtx, mockNext)
            
            expect(mockCtx.body.success).toBe(false)
            expect(mockCtx.body.code).toBe(442)
        })

        it('should handle undefined query params', async () => {
            mockApp.routerSchema = {
                '/api/test': {
                    get: {
                        query: {
                            type: 'object',
                            properties: {
                                name: { type: 'string' }
                            }
                        }
                    }
                }
            }
            mockCtx.path = '/api/test'
            mockCtx.method = 'GET'
            mockCtx.request.query = undefined
            
            await middleware(mockCtx, mockNext)
            
            expect(mockCtx.body.success).toBe(false)
            expect(mockCtx.body.code).toBe(442)
        })
    })
})