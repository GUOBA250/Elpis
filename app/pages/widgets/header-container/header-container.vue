<template>
    <el-container class="header-container">
        <el-header class="header">
            <el-row type="flex" align="middle" class="header-row" justify="start">
                <el-row type="flex" align="middle" class="title-panel" justify="start">
                    <img src="./asserts/logo.png" class="logo" />
                    <el-row class="text">{{ title }}</el-row>
                </el-row>
                <!-- 插槽：菜单区域 -->
                <slot name="menu-content"></slot>
                <!-- 右上方区域 -->
                <slot name="operation-content"></slot>
            </el-row>
        </el-header>
        <el-main class="main-container">
            <slot name="main-content"></slot>
        </el-main>
    </el-container>
</template>

<script setup>
defineProps({
    title: String
})
</script>

<style lang="less" scoped>
.header-container {
    height: 100%;
    min-width: 1000px;
    overflow: hidden;

    .header {
        max-height: 120px;
        height: 60px;
        line-height: 60px;
        border-bottom: 1px solid #e8e8e8;

        .header-row {
            .title-panel {
                width: 180px;
                min-width: 180px;

                .logo {
                    margin-right: 10px;
                    width: 25px;
                    height: 25px;
                    border-radius: 50%;
                    vertical-align: middle;
                }

                .text {
                    font-size: 15px;
                    font-weight: 500;
                }
            }
        }
    }

    .main-container {
        padding: 0;
    }
}

:deep(.el-header) {
    padding: 0
}

:deep(.el-row) {
    display: flex;
    flex-wrap: wrap;
}
</style>
