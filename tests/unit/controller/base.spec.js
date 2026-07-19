const BaseController = require('../../../app/controller/base')

describe('BaseController', () => {
    let baseController
    let mockCtx

    beforeEach(() => {
        const mockApp = {
            service: {},
            config: {},
            logger: {
                error: jest.fn(),
                info: jest.fn()
            },
            options: {
                name: 'Elpis'
            }
        }
        baseController = new (BaseController(mockApp))()
        
        mockCtx = {
            request: { query: {} },
            response: {}
        }
    })

    describe('success', () => {
        it('should return success response with default data', () => {
            baseController.success(mockCtx)

            expect(mockCtx.status).toBe(200)
            expect(mockCtx.body).toBeDefined()
            expect(mockCtx.body.success).toBe(true)
            expect(mockCtx.body.data).toEqual({})
            expect(mockCtx.body.metadata).toEqual({})
        })

        it('should return success response with provided data', () => {
            const testData = { key: 'value', name: 'test' }
            const testMetadata = { total: 10, page: 1 }
            
            baseController.success(mockCtx, testData, testMetadata)

            expect(mockCtx.status).toBe(200)
            expect(mockCtx.body.success).toBe(true)
            expect(mockCtx.body.data).toEqual(testData)
            expect(mockCtx.body.metadata).toEqual(testMetadata)
        })

        it('should return success response with only data', () => {
            const testData = { items: [1, 2, 3] }
            
            baseController.success(mockCtx, testData)

            expect(mockCtx.status).toBe(200)
            expect(mockCtx.body.success).toBe(true)
            expect(mockCtx.body.data).toEqual(testData)
            expect(mockCtx.body.metadata).toEqual({})
        })
    })

    describe('fail', () => {
        it('should return fail response with message and code', () => {
            const testMessage = 'Error occurred'
            const testCode = 500
            
            baseController.fail(mockCtx, testMessage, testCode)

            expect(mockCtx.body).toBeDefined()
            expect(mockCtx.body.success).toBe(false)
            expect(mockCtx.body.message).toBe(testMessage)
            expect(mockCtx.body.code).toBe(testCode)
        })

        it('should return fail response with only message', () => {
            const testMessage = 'Validation error'
            
            baseController.fail(mockCtx, testMessage)

            expect(mockCtx.body).toBeDefined()
            expect(mockCtx.body.success).toBe(false)
            expect(mockCtx.body.message).toBe(testMessage)
            expect(mockCtx.body.code).toBeUndefined()
        })
    })
})