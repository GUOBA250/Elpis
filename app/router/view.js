module.exports = (app, router) => {
  const { view: viewController } = app.controller;

  // 用户访问 http://id:port/view/xxx 能渲染出对应的页面
  router.get("/view/:page", viewController.renderPage.bind(viewController));
  // 用户访问 http://id:port/view/xxx/* 能渲染出对应的页面
  router.get("/view/:page/*", viewController.renderPage.bind(viewController));
};
