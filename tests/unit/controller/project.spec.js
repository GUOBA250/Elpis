const ProjectController = require('../../../app/controller/project')
const ProjectService = require('../../../app/service/project')

describe('ProjectController', () => {
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

        const BaseController = require('../../../app/controller/base')(mockApp)
        mockApp.controller = {}

        const projectService = new (ProjectService(mockApp))()
        mockApp.service.project = projectService

        projectController = new (ProjectController(mockApp))()

        mockCtx = {
            request: { query: {} },
            response: {}
        }
    })

    describe('getList', () => {
        it('should return all projects when projKey is not provided', async () => {
            mockCtx.request.query = {}
            await projectController.getList(mockCtx)

            expect(mockCtx.body).toBeDefined()
            expect(mockCtx.body.success).toBe(true)
            expect(mockCtx.body.data).toBeDefined()
            expect(Array.isArray(mockCtx.body.data)).toBe(true)
            expect(mockCtx.body.data.length).toBe(4)
        })

        it('should return filtered projects when projKey is provided', async () => {
            mockCtx.request.query = { proj_key: 'p1' }
            await projectController.getList(mockCtx)

            expect(mockCtx.body.success).toBe(true)
            expect(mockCtx.body.data.length).toBe(1)
            expect(mockCtx.body.data[0].key).toBe('p1')
        })

        it('should return empty array when projKey does not exist', async () => {
            mockCtx.request.query = { proj_key: 'nonexistent' }
            await projectController.getList(mockCtx)

            expect(mockCtx.body.success).toBe(true)
            expect(mockCtx.body.data.length).toBe(0)
        })

        it('should return dto with correct fields', async () => {
            mockCtx.request.query = {}
            await projectController.getList(mockCtx)

            const project = mockCtx.body.data[0]
            expect(project).toHaveProperty('modelKey')
            expect(project).toHaveProperty('key')
            expect(project).toHaveProperty('name')
            expect(project).toHaveProperty('desc')
            expect(project).toHaveProperty('homePage')
            expect(project).not.toHaveProperty('model')
        })
    })

    describe('getModelList', () => {
        it('should return model list with correct structure', async () => {
            mockCtx.request.query = {}
            await projectController.getModelList(mockCtx)

            expect(mockCtx.body).toBeDefined()
            expect(mockCtx.body.success).toBe(true)
            expect(mockCtx.body.data).toBeDefined()
            expect(Array.isArray(mockCtx.body.data)).toBe(true)
            expect(mockCtx.body.data.length).toBe(3)
        })

        it('should return dto with processed model and project', async () => {
            mockCtx.request.query = {}
            await projectController.getModelList(mockCtx)

            const item = mockCtx.body.data[0]
            expect(item).toHaveProperty('model')
            expect(item).toHaveProperty('project')
            expect(item.model).toHaveProperty('key')
            expect(item.model).toHaveProperty('name')
            expect(item.model).toHaveProperty('desc')
            expect(typeof item.project).toBe('object')
        })

        it('should handle empty project in model', async () => {
            mockCtx.request.query = {}
            await projectController.getModelList(mockCtx)

            const emptyItem = mockCtx.body.data.find(item => Object.keys(item.project).length === 0)
            expect(emptyItem).toBeDefined()
            expect(emptyItem.model.key).toBe('m3')
        })
    })
})