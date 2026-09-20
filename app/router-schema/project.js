module.exports = {
  '/api/proj': {
    get: {
      query: {
        type: 'object',
        properties: {
          proj_key: {
            type: 'string'
          }
        },
        required: ['proj_key']
      }
    }
  },
  '/api/proj/list': {
    get: {
      query: {
        type: 'object',
        properties: {
          proj_key: {
            type: 'string'
          }
        }
      }
    }
  },
  '/api/proj/model_list': {
    get: {}
  }
};
