<template>
  <el-config-provider :locale="zhCn">
    <header-view :proj-name="projName" @menu-select="onMenuSelect">
      <template #main-content>
        <router-view />
      </template>
    </header-view>
  </el-config-provider>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import HeaderView from './complex-view/header-view/header-view.vue';
import $curl from '$elpisCommon/curl';

import { useMenuStore } from '$elpisStore/menu.js';
import { useProjectStore } from '$elpisStore/project.js';

const router = useRouter();
const route = useRoute();
const menuStore = useMenuStore();
const projectStore = useProjectStore();

const projName = ref('');

onMounted(() => {
  getProjectList();
  getProjectConfig();
});

// 请求 /api/proj/list 接口，并缓存到store
async function getProjectList() {
  const res = await $curl({
    method: 'get',
    url: '/api/proj/list',
    query: {
      proj_key: route.query.proj_key
    }
  });
  if (!res || !res.success || !res.data) {
    return;
  }
  projectStore.setProjectList(res.data);
}

// 请求 /api/proj 接口，并缓存到store
async function getProjectConfig() {
  const res = await $curl({
    method: 'get',
    url: '/api/proj',
    query: {
      proj_key: route.query.proj_key
    }
  });
  if (!res || !res.success || !res.data) {
    return;
  }

  const { name, menu } = res.data;
  projName.value = name;
  menuStore.setMenuList(menu);
}

// 点击菜单回调
const onMenuSelect = (menuItem) => {
  const { moduleType, key, customConfig } = menuItem;
  if (key === route.query.key) return;

  const pathMap = {
    sider: '/sider',
    iframe: '/iframe',
    schema: '/schema',
    custom: customConfig?.path
  };

  router.push({
    path: `/view/dashboard${pathMap[moduleType]}`,
    query: {
      key,
      proj_key: route.query.proj_key
    }
  });
};
</script>

<style lang="less" scoped>
:deep(.el-main) {
  padding: 0;
}
</style>
