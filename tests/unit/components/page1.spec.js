const { mount } = require('@vue/test-utils')
const Page1 = require('../../../app/pages/page1/page1.vue').default

describe('Page1 Component', () => {
    let wrapper

    beforeEach(() => {
        wrapper = mount(Page1)
    })

    afterEach(() => {
        wrapper.unmount()
    })

    it('should render correctly', () => {
        expect(wrapper.exists()).toBe(true)
        expect(wrapper.find('h1').exists()).toBe(true)
        expect(wrapper.find('h1').text()).toBe('Page1')
    })

    it('should have page1-container class', () => {
        expect(wrapper.find('.page1-container').exists()).toBe(true)
    })
})
