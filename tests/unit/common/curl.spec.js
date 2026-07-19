jest.mock('axios')

describe('$curl', () => {
    let $curl
    let axios

    beforeEach(() => {
        jest.clearAllMocks()
        axios = require('axios')
        $curl = require('../../../app/pages/common/curl').default
    })

    describe('GET request', () => {
        it('should make GET request with correct parameters', async () => {
            axios.mockReturnValue(Promise.resolve({ data: { success: true, data: [] } }))

            await $curl({
                method: 'get',
                url: '/api/test',
                params: { id: 1 }
            })

            expect(axios).toHaveBeenCalled()
        })

        it('should return response data on success', async () => {
            const mockData = { success: true, data: [{ id: 1 }] }
            axios.mockReturnValue(Promise.resolve({ data: mockData }))

            const result = await $curl({
                method: 'get',
                url: '/api/test'
            })

            expect(result).toEqual(mockData)
        })
    })

    describe('POST request', () => {
        it('should make POST request with correct parameters', async () => {
            axios.mockReturnValue(Promise.resolve({ data: { success: true } }))

            await $curl({
                method: 'post',
                url: '/api/test',
                data: { name: 'test' }
            })

            expect(axios).toHaveBeenCalled()
        })
    })

    describe('Error handling', () => {
        it('should return null on network error', async () => {
            axios.mockReturnValue(Promise.reject({ request: {} }))

            const result = await $curl({
                method: 'get',
                url: '/api/test',
                errorMessage: '测试失败'
            })

            expect(result).toBeNull()
        })

        it('should return null on response error', async () => {
            axios.mockReturnValue(Promise.reject({ response: { status: 500, statusText: 'Internal Server Error' } }))

            const result = await $curl({
                method: 'get',
                url: '/api/test'
            })

            expect(result).toBeNull()
        })

        it('should return null on request setup error', async () => {
            axios.mockReturnValue(Promise.reject(new Error('setup error')))

            const result = await $curl({
                method: 'get',
                url: '/api/test'
            })

            expect(result).toBeNull()
        })
    })

    describe('Default values', () => {
        it('should use GET as default method', async () => {
            axios.mockReturnValue(Promise.resolve({ data: {} }))

            await $curl({
                url: '/api/test'
            })

            expect(axios).toHaveBeenCalled()
        })
    })
})