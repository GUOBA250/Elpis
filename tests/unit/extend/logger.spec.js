const loggerExtend = require('../../../app/extend/logger')

describe('logger extend', () => {
    let mockApp

    beforeEach(() => {
        mockApp = {
            env: {},
            options: {}
        }
    })

    describe('local environment', () => {
        it('should return console when in local environment', () => {
            mockApp.env.isLocal = jest.fn().mockReturnValue(true)
            
            const logger = loggerExtend(mockApp)
            
            expect(logger).toBe(console)
        })

        it('should have info method in local environment', () => {
            mockApp.env.isLocal = jest.fn().mockReturnValue(true)
            
            const logger = loggerExtend(mockApp)
            
            expect(typeof logger.info).toBe('function')
            expect(typeof logger.error).toBe('function')
        })
    })

    describe('non-local environment', () => {
        let originalLog4js
        let mockLog4js

        beforeEach(() => {
            originalLog4js = require('log4js')
            mockLog4js = {
                configure: jest.fn(),
                getLogger: jest.fn().mockReturnValue({
                    info: jest.fn(),
                    error: jest.fn(),
                    warn: jest.fn(),
                    debug: jest.fn()
                })
            }
            jest.doMock('log4js', () => mockLog4js)
        })

        afterEach(() => {
            jest.resetModules()
        })

        it('should configure log4js when not in local environment', () => {
            jest.resetModules()
            mockApp.env.isLocal = jest.fn().mockReturnValue(false)
            
            const loggerExtendLocal = require('../../../app/extend/logger')
            loggerExtendLocal(mockApp)
            
            expect(mockLog4js.configure).toHaveBeenCalled()
        })

        it('should return log4js logger when not in local environment', () => {
            jest.resetModules()
            mockApp.env.isLocal = jest.fn().mockReturnValue(false)
            
            const loggerExtendLocal = require('../../../app/extend/logger')
            const logger = loggerExtendLocal(mockApp)
            
            expect(mockLog4js.getLogger).toHaveBeenCalledWith('application')
            expect(typeof logger.info).toBe('function')
            expect(typeof logger.error).toBe('function')
        })

        it('should configure console and file appenders', () => {
            jest.resetModules()
            mockApp.env.isLocal = jest.fn().mockReturnValue(false)
            
            const loggerExtendLocal = require('../../../app/extend/logger')
            loggerExtendLocal(mockApp)
            
            const config = mockLog4js.configure.mock.calls[0][0]
            expect(config.appenders).toHaveProperty('console')
            expect(config.appenders).toHaveProperty('dataFile')
            expect(config.appenders.dataFile.filename).toBe('./logs/application.log')
            expect(config.appenders.dataFile.pattern).toBe('.yyyy-MM-dd')
        })

        it('should configure default category with console and dataFile appenders', () => {
            jest.resetModules()
            mockApp.env.isLocal = jest.fn().mockReturnValue(false)
            
            const loggerExtendLocal = require('../../../app/extend/logger')
            loggerExtendLocal(mockApp)
            
            const config = mockLog4js.configure.mock.calls[0][0]
            expect(config.categories.default.appenders).toEqual(['console', 'dataFile'])
            expect(config.categories.default.level).toBe('trace')
        })
    })

    describe('edge cases', () => {
        it('should use log4js when isLocal returns undefined', () => {
            jest.resetModules()
            mockApp.env.isLocal = jest.fn().mockReturnValue(undefined)
            
            const loggerExtendLocal = require('../../../app/extend/logger')
            const logger = loggerExtendLocal(mockApp)
            
            expect(typeof logger.info).toBe('function')
        })

        it('should use log4js when isLocal returns false', () => {
            jest.resetModules()
            mockApp.env.isLocal = jest.fn().mockReturnValue(false)
            
            const loggerExtendLocal = require('../../../app/extend/logger')
            const logger = loggerExtendLocal(mockApp)
            
            expect(typeof logger.info).toBe('function')
        })

        it('should use log4js when isLocal is not a function', () => {
            jest.resetModules()
            mockApp.env.isLocal = true
            
            const loggerExtendLocal = require('../../../app/extend/logger')
            const logger = loggerExtendLocal(mockApp)
            
            expect(typeof logger.info).toBe('function')
        })
    })
})