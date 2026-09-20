<template>
  <el-container class="header-container">
    <el-header class="header">
      <el-row type="flex" align="middle" class="header-row">
        <!-- 左上角logo位 -->
        <el-row type="flex" align="middle" class="title-panel">
          <img src="./assets/logo.png" class="logo" />
          <el-row class="text">
            {{ title }}
          </el-row>
        </el-row>
        <!-- 插槽：菜单 -->
        <slot name="menu-content" />
        <!-- 插槽：系统设置 -->
        <el-row type="flex" align="middle" justify="end" class="setting-panel">
          <!-- 自定义设置区域 -->
          <slot name="setting-content" />
          <!-- 动态组件 -->
          <component
            v-if="BusinessHeaderConfig?.userPanel"
            :is="BusinessHeaderConfig.userPanel.component"
          />
        </el-row>
      </el-row>
    </el-header>
    <el-main class="main-container">
      <!-- 内容插槽 -->
      <slot name="main-content" />
    </el-main>
  </el-container>
</template>

<script setup>
import BusinessHeaderConfig from "$businessHeaderConfig";

defineProps({
  title: {
    type: String,
    default: "Elpis",
  },
});
</script>

<style lang="less" scoped>
.header-container {
  height: 100%;
  min-width: 1000px;
  overflow: hidden;

  .header {
    max-height: 120px;
    border-bottom: 1px solid #e8e8e8;

    .header-row {
      height: 60px;
      padding: 0 20px;

      .title-panel {
        width: 180px;
        min-width: 180px;

        .logo {
          margin-right: 10px;
          width: 25px;
          height: 25px;
          border-radius: 50%;
        }

        .text {
          font-size: 15px;
          font-weight: 500;
        }
      }
      .setting-panel {
        margin-left: auto;
        min-width: 180px;

        .avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          margin-right: 12px;
        }
        .username {
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          height: 60px;
          line-height: 60px;
          outline: none;
        }
      }
    }
  }

  // .man-container {}
}

:deep(.el-header) {
  padding: 0;
}
</style>
