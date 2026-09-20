module.exports = (app, router) => {
  const { project: projectController } = app.controller;

  router.get('/api/proj', projectController.get.bind(projectController));
  router.get('/api/proj/list', projectController.getList.bind(projectController));
  router.get('/api/proj/model_list', projectController.getModelList.bind(projectController));
};
