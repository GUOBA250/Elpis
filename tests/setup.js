global.TextEncoder = require('util').TextEncoder
global.TextDecoder = require('util').TextDecoder

global.axios = require('axios')
global.md5 = require('md5')

jest.mock('axios', () => ({
    request: jest.fn()
}))

jest.mock('@/utils/message', () => ({
    ELMESSAGE: {
        error: jest.fn()
    }
}))
