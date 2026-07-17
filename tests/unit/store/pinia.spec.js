const { createPinia } = require('pinia')

describe('Pinia Store', () => {
    it('should create pinia instance', () => {
        const pinia = createPinia()
        expect(pinia).toBeDefined()
        expect(typeof pinia).toBe('object')
    })

    it('should have install method', () => {
        const pinia = createPinia()
        expect(typeof pinia.install).toBe('function')
    })

    it('should export default pinia instance', () => {
        const pinia = require('../../../app/pages/store/index').default
        expect(pinia).toBeDefined()
        expect(typeof pinia).toBe('object')
        expect(typeof pinia.install).toBe('function')
    })
})
