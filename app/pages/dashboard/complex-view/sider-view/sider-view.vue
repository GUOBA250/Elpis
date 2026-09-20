<template>
  <sider-container>
    <template #menu-content>
      <el-menu
        :default-active="activeKey"
        :ellipsis="true"
        @select="onMenuSelect"
      >
        <template v-for="item in menuList">
          <sub-menu
            v-if="item.subMenu && item.subMenu.length > 0"
            :menu-item="item"
          ></sub-menu>
          <el-menu-item v-else :index="item.key">
            {{ item.name }}
          </el-menu-item>
        </template>
      </el-menu>
    </template>
    <template #main-content>
      <router-view></router-view>
    </template>
  </sider-container>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMenuStore } from "$elpisStore/menu.js";
import SiderContainer from "$elpisWidgets/sider-container/sider-container.vue";
import SubMenu from "../sub-menu/sub-menu.vue";

const route = useRoute();
const router = useRouter();
const menuStore = useMenuStore();

const activeKey = ref("");
const menuList = ref([]);

const setMenuList = function () {
  const menuItem = menuStore.findMenuItem({
    key: "key",
    value: route.query.key,
  });
  if (menuItem && menuItem.siderConfig && menuItem.siderConfig.menu) {
    menuList.value = menuItem.siderConfig.menu;
  }
};

const setActiveKey = function () {
  let siderMenuItem = menuStore.findMenuItem({
    key: "key",
    value: route.query.sider_key,
  });

  // 如果没有找到侧边栏菜单key，默认使用侧边栏菜单的第一个菜单项(递归查找)
  if (!siderMenuItem) {
    const hMenuItem = menuStore.findMenuItem({
      key: "key",
      value: route.query.key,
    });
    if (hMenuItem && hMenuItem.siderConfig && hMenuItem.siderConfig.menu) {
      const siderMenuList = hMenuItem.siderConfig.menu;
      siderMenuItem = menuStore.findFirstMenuItem(siderMenuList);
      if (siderMenuItem) {
        handleMenuSelect(siderMenuItem.key);
      }
    }
  }
  // 更新选中的菜单项
  activeKey.value = siderMenuItem?.key;
};

// 路由参数 key ，对应菜单 key
watch(
  () => route.query.key,
  () => {
    setMenuList();
    setActiveKey();
  }
);

watch(
  () => menuStore.menuList,
  () => {
    setMenuList();
    setActiveKey();
  },
  { deep: true }
);

const handleMenuSelect = function (menuKey) {
  const menuItem = menuStore.findMenuItem({
    key: "key",
    value: menuKey,
  });
  const { moduleType, key, customConfig } = menuItem;

  if (key === route.query.sider_key) {
    return;
  }

  const pathMap = {
    iframe: "/iframe",
    schema: "/schema",
    custom: customConfig?.path,
  };
  router.push({
    path: `/view/dashboard/sider${pathMap[moduleType]}`,
    query: {
      key: route.query.key,
      sider_key: key,
      proj_key: route.query.proj_key,
    },
  });
};

const onMenuSelect = function (menuKey) {
  handleMenuSelect(menuKey);
};

onMounted(() => {
  setMenuList();
  setActiveKey();
});
</script>

<style lang="less" scoped></style>
