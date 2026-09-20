<template>
  <iframe :src="path" class="iframe"></iframe>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useMenuStore } from "$elpisStore/menu.js";

const route = useRoute();
const menuStore = useMenuStore();

const path = ref("");

watch(
  [
    () => route.query.key,
    () => route.query.sider_key,
    () => menuStore.menuList,
  ],
  () => {
    setPath();
  },
  { deep: true }
);

onMounted(() => {
  setPath();
});

const setPath = () => {
  const { key, sider_key: siderKey } = route.query;
  const menuItem = menuStore.findMenuItem({
    key: "key",
    value: siderKey ?? key,
  });

  path.value = menuItem?.iframeConfig?.path ?? "";
};
</script>

<style lang="less" scoped>
.iframe {
  border: none;
  width: 100%;
  height: 100%;
}
</style>
