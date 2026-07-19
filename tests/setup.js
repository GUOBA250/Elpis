global.TextEncoder = require('util').TextEncoder
global.TextDecoder = require('util').TextDecoder

global.md5 = require('md5')

jest.mock('axios', () => jest.fn())

jest.mock('@/utils/message', () => ({
    ELMESSAGE: {
        error: jest.fn()
    }
}))
