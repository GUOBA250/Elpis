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

    it('should return project list without proj_key', async () => {
        mockCtx.request.query = {}
        
        const result = await projectController.getList(mockCtx)
        
        expect(mockCtx.body).toBeDefined()
        expect(mockCtx.body.success).toBe(true)
        expect(Array.isArray(mockCtx.body.data)).toBe(true)
        expect(mockCtx.body.data.length).toBe(3)
    })

    it('should return filtered project list with proj_key', async () => {
        mockCtx.request.query = { proj_key: 'p1' }
        
        await projectController.getList(mockCtx)
        
        expect(mockCtx.body.success).toBe(true)
        expect(mockCtx.body.data.length).toBe(1)
        expect(mockCtx.body.data[0].key).toBe('p1')
    })

    it('should return empty list for non-existent proj_key', async () => {
        mockCtx.request.query = { proj_key: 'invalid' }
        
        await projectController.getList(mockCtx)
        
        expect(mockCtx.body.success).toBe(true)
        expect(mockCtx.body.data.length).toBe(0)
    })
})
