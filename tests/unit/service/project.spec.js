const ProjectService = require('../../../app/service/project')

describe('ProjectService', () => {
    let projectService

    beforeEach(() => {
        const mockApp = {}
        projectService = new (ProjectService(mockApp))()
    })

    describe('getModelList', () => {
        it('should return model list', async () => {
            const result = await projectService.getModelList()
            expect(result).toBeDefined()
        })
    })
})
