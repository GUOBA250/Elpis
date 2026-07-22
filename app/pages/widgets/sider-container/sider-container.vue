<template>
    <el-container>
        <el-aside width="200px" class="aside">
            <slot name="menu-content" />
        </el-aside>
        <el-main class="main">
            <slot name="main-content" />
        </el-main>
    </el-container>
</template>

<script setup></script>

<style scoped lang="less">
.sider-container {
    height: 100%;

    .aside {
        border-right: 1px solid #e4e7ed;
    }

    .main {
        overflow: scroll
    }
}

:deep(.el-menu) {
    border-right: 0;
}
</style>
