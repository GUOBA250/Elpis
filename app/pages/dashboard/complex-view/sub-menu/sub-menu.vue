<template>
  <el-sub-menu :index="menuItem.key">
    <template #title>
      {{ menuItem.name }}
    </template>
    <template v-for="item in menuItem.subMenu">
      <sub-menu
        v-if="item.subMenu && item.subMenu.length > 0"
        :key="item.key"
        :menu-item="item"
      ></sub-menu>
      <el-menu-item v-else :index="item.key">
        {{ item.name }}
      </el-menu-item>
    </template>
  </el-sub-menu>
</template>

<script setup>
// eslint-disable-next-line vue/require-prop-types
const { menuItem } = defineProps(['menuItem']);
</script>

<style lang="less" scoped></style>
