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

    describe('GET /api/project/list', () => {
        it('should return all projects when no query params', async () => {
            mockCtx.request.query = {}

            await projectController.getList(mockCtx)

            expect(mockCtx.body).toBeDefined()
            expect(mockCtx.body.success).toBe(true)
            expect(mockCtx.body.data.length).toBe(6)
        })

        it('should return filtered projects when proj_key is provided', async () => {
            mockCtx.request.query = { proj_key: 'p2' }

            await projectController.getList(mockCtx)

            expect(mockCtx.body.success).toBe(true)
            expect(mockCtx.body.data.length).toBe(1)
            expect(mockCtx.body.data[0].name).toBe('项目2')
        })
    })

    describe('GET /api/project/model_list', () => {
        it('should return model list with processed data', async () => {
            mockCtx.request.query = {}

            await projectController.getModelList(mockCtx)

            expect(mockCtx.body).toBeDefined()
            expect(mockCtx.body.success).toBe(true)
            expect(mockCtx.body.data.length).toBe(5)

            const firstItem = mockCtx.body.data[0]
            expect(firstItem.model.key).toBe('m1')
            expect(firstItem.model.name).toBe('模型1')
            expect(Object.keys(firstItem.project).length).toBe(2)
        })

        it('should return correct dto structure without extra fields', async () => {
            mockCtx.request.query = {}

            await projectController.getModelList(mockCtx)

            const item = mockCtx.body.data[0]
            expect(item.model).not.toHaveProperty('project')
            expect(typeof item.project).toBe('object')
        })
    })

    describe('Service and Controller Integration', () => {
        it('should correctly map service response to controller dto', async () => {
            const serviceResult = await projectService.getList()
            
            mockCtx.request.query = {}
            await projectController.getList(mockCtx)

            const controllerResult = mockCtx.body.data

            expect(controllerResult.length).toBe(serviceResult.length)
            controllerResult.forEach((dto, index) => {
                expect(dto.key).toBe(serviceResult[index].key)
                expect(dto.name).toBe(serviceResult[index].name)
                expect(dto.desc).toBe(serviceResult[index].desc)
            })
        })
    })
})