const path = require('path')
const { sep } = path

describe('model/index.js', () => {
    let modelIndex
    let projectExtendModel
    let mockApp

    beforeEach(() => {
        jest.resetModules()
        mockApp = {
            baseDir: '/test/base/dir'
        }
    })

    describe('projectExtendModel', () => {
        beforeEach(() => {
            jest.doMock('lodash', () => ({
                mergeWith: jest.fn((obj, model, project, customizer) => {
                    const result = { ...obj, ...model }
                    if (project) {
                        for (const key in project) {
                            result[key] = project[key]
                        }
                    }
                    return result
                })
            }))
            modelIndex = require('../../../model/index')
            projectExtendModel = modelIndex.__projectExtendModel
        })

        it('should merge non-array objects', () => {
            const model = { a: 1, b: 2 }
            const project = { b: 3, c: 4 }
            
            const result = projectExtendModel(model, project)
            
            expect(result).toBeDefined()
            expect(result.a).toBe(1)
            expect(result.b).toBe(3)
            expect(result.c).toBe(4)
        })

        it('should extend array with inherited items', () => {
            const model = [{ key: 'item1', value: 'original' }]
            const project = [{ key: 'item1', value: 'modified' }, { key: 'item2', value: 'new' }]
            
            const result = projectExtendModel(model, project)
            
            expect(result).toBeDefined()
            expect(result.length).toBe(2)
            expect(result[0].value).toBe('modified')
            expect(result[1].key).toBe('item2')
        })

        it('should keep model items not in project', () => {
            const model = [{ key: 'item1', value: 'original' }, { key: 'item2', value: 'keep' }]
            const project = [{ key: 'item1', value: 'modified' }]
            
            const result = projectExtendModel(model, project)
            
            expect(result.length).toBe(2)
            expect(result[0].value).toBe('modified')
            expect(result[1].value).toBe('keep')
        })

        it('should handle null model', () => {
            const model = null
            const project = { a: 1 }
            
            const result = projectExtendModel(model, project)
            
            expect(result).toBeDefined()
            expect(result.a).toBe(1)
        })

        it('should handle null project', () => {
            const model = { a: 1 }
            const project = null
            
            const result = projectExtendModel(model, project)
            
            expect(result).toBeDefined()
            expect(result.a).toBe(1)
        })

        it('should handle empty arrays', () => {
            const model = []
            const project = []
            
            const result = projectExtendModel(model, project)
            
            expect(result).toEqual([])
        })

        it('should handle nested arrays', () => {
            const model = [{ key: 'item1', children: [{ key: 'child1', value: 'original' }] }]
            const project = [{ key: 'item1', children: [{ key: 'child1', value: 'modified' }, { key: 'child2', value: 'new' }] }]
            
            const result = projectExtendModel(model, project)
            
            expect(result.length).toBe(1)
            expect(result[0].children.length).toBe(2)
            expect(result[0].children[0].value).toBe('modified')
            expect(result[0].children[1].key).toBe('child2')
        })
    })

    describe('module exports', () => {
        beforeEach(() => {
            jest.doMock('lodash', () => ({
                mergeWith: jest.fn((obj, model, project, customizer) => {
                    const result = { ...obj, ...model }
                    if (project) {
                        for (const key in project) {
                            result[key] = project[key]
                        }
                    }
                    return result
                })
            }))
        })

        it('should return model list when called with app', () => {
            jest.doMock('glob', () => ({
                sync: jest.fn().mockReturnValue([])
            }))
            modelIndex = require('../../../model/index')
            
            const result = modelIndex(mockApp)
            
            expect(result).toEqual([])
        })

        it('should skip index.js files', () => {
            jest.doMock('glob', () => ({
                sync: jest.fn().mockReturnValue([
                    `/test/base/dir${sep}model${sep}index.js`
                ])
            }))
            modelIndex = require('../../../model/index')
            
            const result = modelIndex(mockApp)
            
            expect(result).toEqual([])
        })

        it('should skip files without valid modelKey', () => {
            const mockGlobSync = jest.fn().mockReturnValue([
                `/test/base/dir${sep}model${sep}invalid${sep}somefile.js`
            ])
            jest.doMock('glob', () => ({ sync: mockGlobSync }))
            modelIndex = require('../../../model/index')
            
            const result = modelIndex(mockApp)
            
            expect(result).toEqual([])
        })

        it('should process actual model files in project', () => {
            jest.doMock('glob', () => ({
                sync: jest.fn().mockReturnValue([
                    path.resolve(__dirname, '../../../model/business/model.js'),
                    path.resolve(__dirname, '../../../model/course/model.js')
                ])
            }))
            modelIndex = require('../../../model/index')
            
            const result = modelIndex({ baseDir: __dirname + '/../../../' })
            
            expect(Array.isArray(result)).toBe(true)
        })
    })
})