const ProjectService = require('../../../app/service/project')
const ProjectController = require('../../../app/controller/project')

describe('Project API Integration', () => {
    let projectService
    let projectController
    let mockCtx

    beforeEach(() => {
        const mockApp = {
            service: {},
            logger: {
                error: jest.fn(),
                info: jest.fn()
            },
            options: {
                name: 'Elpis'
            }
        }
        
        projectService = new (ProjectService(mockApp))()
        mockApp.service.project = projectService
        
        projectController = new (ProjectController(mockApp))()
        
        mockCtx = {
            request: { query: {} },
            response: {}
        }
    })

    it('should return model list', async () => {
        mockCtx.request.query = {}
        
        const result = await projectController.getModelList(mockCtx)
        
        expect(mockCtx.body).toBeDefined()
        expect(mockCtx.body.success).toBe(true)
    })
})
