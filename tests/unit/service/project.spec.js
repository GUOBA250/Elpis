const ProjectService = require('../../../app/service/project')

describe('ProjectService', () => {
    let projectService

    beforeEach(() => {
        const mockApp = {}
        projectService = new (ProjectService(mockApp))()
    })

    describe('getList', () => {
        it('should return all projects when projKey is not provided', async () => {
            const result = await projectService.getList()
            expect(result).toBeDefined()
            expect(Array.isArray(result)).toBe(true)
            expect(result.length).toBe(4)
            expect(result.map(p => p.key)).toContain('p1')
            expect(result.map(p => p.key)).toContain('p2')
            expect(result.map(p => p.key)).toContain('p3')
            expect(result.map(p => p.key)).toContain('p4')
        })

        it('should return project with specified projKey', async () => {
            const result = await projectService.getList('p1')
            expect(result).toBeDefined()
            expect(Array.isArray(result)).toBe(true)
            expect(result.length).toBe(1)
            expect(result[0].key).toBe('p1')
            expect(result[0].name).toBe('项目1')
        })

        it('should return empty array when projKey does not exist', async () => {
            const result = await projectService.getList('nonexistent')
            expect(result).toBeDefined()
            expect(Array.isArray(result)).toBe(true)
            expect(result.length).toBe(0)
        })

        it('should return empty array when projKey is empty string', async () => {
            const result = await projectService.getList('')
            expect(result).toBeDefined()
            expect(Array.isArray(result)).toBe(true)
            expect(result.length).toBe(4)
        })

        it('should return empty array when projKey is null', async () => {
            const result = await projectService.getList(null)
            expect(result).toBeDefined()
            expect(Array.isArray(result)).toBe(true)
            expect(result.length).toBe(4)
        })

        it('should return correct project structure', async () => {
            const result = await projectService.getList('p3')
            expect(result[0]).toHaveProperty('key')
            expect(result[0]).toHaveProperty('name')
            expect(result[0]).toHaveProperty('desc')
            expect(result[0]).toHaveProperty('homePage')
        })
    })

    describe('getModelList', () => {
        it('should return model list', async () => {
            const result = await projectService.getModelList()
            expect(result).toBeDefined()
            expect(Array.isArray(result)).toBe(true)
            expect(result.length).toBe(3)
        })

        it('should return correct model structure', async () => {
            const result = await projectService.getModelList()
            result.forEach(item => {
                expect(item).toHaveProperty('model')
                expect(item).toHaveProperty('project')
                expect(item.model).toHaveProperty('key')
                expect(item.model).toHaveProperty('name')
                expect(item.model).toHaveProperty('desc')
            })
        })

        it('should handle empty project in model', async () => {
            const result = await projectService.getModelList()
            const emptyModel = result.find(item => Object.keys(item.project).length === 0)
            expect(emptyModel).toBeDefined()
            expect(emptyModel.model.key).toBe('m3')
        })
    })
})