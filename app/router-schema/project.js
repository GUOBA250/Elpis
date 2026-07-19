module.exports = {
    '/api/project/model_list': {
        get: {},
        post: {},
        put: {},
        delete: {},
    },
    '/api/project/list': {
        get: {
            query: {
                type: 'object',
                properties: {
                    proj_key: {
                        type: 'string',
                    }
                }
            },
        },
        post: {},
    },
    '/api/project': {
        get: {
            query: {
                type: 'object',
                properties: {
                    proj_key: {
                        type: 'string',
                    }
                },
                required: ['proj_key'],
            },
        },
        post: {},
    }
}
