const axios = require('axios')
const { ELMESSAGE } = require('@/utils/message')
const md5 = require('md5')

describe('curl', () => {
    let curl

    beforeEach(() => {
        axios.request.mockReset()
        ELMESSAGE.error.mockReset()
        curl = require('../../../app/pages/common/curl').default
    })

    it('should send request with correct parameters', async () => {
        axios.request.mockResolvedValue({
            data: { success: true, data: [], metadata: {} }
        })

        await curl({
            url: '/api/test',
            method: 'get',
            data: { key: 'value' },
            query: { q: 'test' }
        })

        expect(axios.request).toHaveBeenCalledTimes(1)
        const callArgs = axios.request.mock.calls[0][0]
        expect(callArgs.url).toBe('/api/test')
        expect(callArgs.method).toBe('get')
        expect(callArgs.params).toEqual({ q: 'test' })
        expect(callArgs.data).toEqual({ key: 'value' })
        expect(callArgs.headers.s_t).toBeDefined()
        expect(callArgs.headers.s_sign).toBeDefined()
    })

    it('should generate correct signature', async () => {
        const mockDateNow = 1234567890123
        const originalDateNow = Date.now
        Date.now = jest.fn(() => mockDateNow)

        axios.request.mockResolvedValue({
            data: { success: true, data: [], metadata: {} }
        })

        await curl({ url: '/api/test' })

        const callArgs = axios.request.mock.calls[0][0]
        const expectedSign = md5(`klklfadfkj1341adjoiwejhwqhghj123_${mockDateNow}`)
        expect(callArgs.headers.s_sign).toBe(expectedSign)

        Date.now = originalDateNow
    })

    it('should return success data when API returns success', async () => {
        const mockData = { items: ['item1', 'item2'] }
        const mockMetadata = { total: 2 }
        axios.request.mockResolvedValue({
            data: { success: true, data: mockData, metadata: mockMetadata }
        })

        const result = await curl({ url: '/api/test' })

        expect(result.success).toBe(true)
        expect(result.data).toEqual(mockData)
        expect(result.metadata).toEqual(mockMetadata)
    })

    it('should handle API failure with error code 442', async () => {
        axios.request.mockResolvedValue({
            data: { success: false, code: 442, message: '参数校验失败' }
        })

        const result = await curl({ url: '/api/test' })

        expect(result.success).toBe(false)
        expect(result.code).toBe(442)
        expect(result.message).toBe('参数校验失败')
        expect(ELMESSAGE.error).toHaveBeenCalledWith('参数校验失败')
    })

    it('should handle API failure with error code 445', async () => {
        axios.request.mockResolvedValue({
            data: { success: false, code: 445, message: '签名校验失败' }
        })

        const result = await curl({ url: '/api/test' })

        expect(result.success).toBe(false)
        expect(result.code).toBe(445)
        expect(ELMESSAGE.error).toHaveBeenCalledWith('签名校验失败')
    })

    it('should handle timeout error', async () => {
        axios.request.mockRejectedValue({ message: 'timeout of 60000ms exceeded' })

        const result = await curl({ url: '/api/test' })

        expect(result.message).toBe('Request timeout')
        expect(result.code).toBe(504)
    })

    it('should handle network error', async () => {
        const mockError = { message: 'Network Error', code: 'ERR_NETWORK' }
        axios.request.mockRejectedValue(mockError)

        const result = await curl({ url: '/api/test' })

        expect(result.message).toBe(mockError.message)
    })

    it('should use default method POST when not specified', async () => {
        axios.request.mockResolvedValue({
            data: { success: true, data: [], metadata: {} }
        })

        await curl({ url: '/api/test' })

        const callArgs = axios.request.mock.calls[0][0]
        expect(callArgs.method).toBe('post')
    })

    it('should use default timeout of 60000ms', async () => {
        axios.request.mockResolvedValue({
            data: { success: true, data: [], metadata: {} }
        })

        await curl({ url: '/api/test' })

        const callArgs = axios.request.mock.calls[0][0]
        expect(callArgs.timeout).toBe(60000)
    })
})
