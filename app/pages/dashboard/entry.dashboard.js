import boot from "$elpisPages/boot.js";
import PageComponent from "./dashboard.vue";
import businessDashboardRouterConfig from "$businessDashboardRouterConfig";

const routes = [];

// 头部菜单路由
routes.push({
  path: "/view/dashboard/iframe",
  component: () => import("./complex-view/iframe-view/iframe-view.vue"),
});
routes.push({
  path: "/view/dashboard/schema",
  component: () => import("./complex-view/schema-view/schema-view.vue"),
});

const siderRoutes = [
  {
    path: "iframe",
    component: () => import("./complex-view/iframe-view/iframe-view.vue"),
  },
  {
    path: "schema",
    component: () => import("./complex-view/schema-view/schema-view.vue"),
  },
];

// 业务扩展路由
if (typeof businessDashboardRouterConfig === "function") {
  businessDashboardRouterConfig({ routes, siderRoutes });
}

// 侧边栏菜单路由（头部菜单的子路由）
routes.push({
  path: "/view/dashboard/sider",
  component: () => import("./complex-view/sider-view/sider-view.vue"),
  children: siderRoutes,
});


// 侧边栏兜底策略
routes.push({
  path: "/view/dashboard/sider/:chapters+",
  component: () => import("./complex-view/sider-view/sider-view.vue"),
});

boot(PageComponent, { routes });
