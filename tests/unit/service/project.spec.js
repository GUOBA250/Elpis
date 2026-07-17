const ProjectService = require('../../../app/service/project')

describe('ProjectService', () => {
    let projectService

    beforeEach(() => {
        const mockApp = {}
        projectService = new (ProjectService(mockApp))()
    })

    describe('getList', () => {
        it('should return all projects when no projKey is provided', async () => {
            const result = await projectService.getList()
            expect(result).toBeDefined()
            expect(Array.isArray(result)).toBe(true)
            expect(result.length).toBe(3)
            expect(result[0].name).toBe('project1')
            expect(result[1].name).toBe('project2')
            expect(result[2].name).toBe('project3')
        })

        it('should return filtered project when projKey is provided', async () => {
            const result = await projectService.getList('p1')
            expect(result).toBeDefined()
            expect(Array.isArray(result)).toBe(true)
            expect(result.length).toBe(1)
            expect(result[0].name).toBe('project1')
            expect(result[0].key).toBe('p1')
        })

        it('should return empty array when projKey does not match', async () => {
            const result = await projectService.getList('invalid_key')
            expect(result).toBeDefined()
            expect(Array.isArray(result)).toBe(true)
            expect(result.length).toBe(0)
        })

        it('should handle null projKey', async () => {
            const result = await projectService.getList(null)
            expect(result.length).toBe(3)
        })

        it('should handle undefined projKey', async () => {
            const result = await projectService.getList(undefined)
            expect(result.length).toBe(3)
        })
    })
})
