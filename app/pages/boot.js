import { createApp } from "vue";

// 引入element-plus
import ElementPlus from "element-plus";
import "element-plus/theme-chalk/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";

import "./assets/css/custom.css";

import { createRouter, createWebHistory } from "vue-router";
import pinia from "$elpisStore";

/**
 * 页面入口
 * @param pageComponent 页面组件
 */
export default function (pageComponent, { routes = [], libs } = {}) {
  const app = createApp(pageComponent);

  // 全局注册 element-plus
  app.use(ElementPlus);

  // 使用pinia, 状态管理
  app.use(pinia);

  // 使用第三方库
  if (libs && libs.length > 0) {
    libs.forEach((lib) => {
      app.use(lib);
    });
  }

  if (routes && routes.length > 0) {
    const router = createRouter({
      // 使用history模式
      history: createWebHistory(),
      routes,
    });

    app.use(router);
    router.isReady().then(() => {
      // 挂载页面
      app.mount("#root");
    });
  } else {
    app.mount("#root");
  }
}
