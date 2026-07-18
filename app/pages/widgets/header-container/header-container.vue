<template>
    <el-container class="header-container">
        <el-header class="header"></el-header>
        <el-main class="main-container">
            <slot name="main-content"></slot>
        </el-main>
    </el-container>
</template>

<script setup></script>

<style lang="less" scoped>
.header-container {
    height: 100%;
    min-width: 1000px;
    overflow: hidden;

    .header {
        max-height: 120px;
        border-bottom: 1px solid #e8e8e8;
    }
    .main-container {}
}

:deep(.el-header) {
    padding: 0
}
</style>
