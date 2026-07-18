<template>
    <el-container class="header-container">
        <el-header class="header">
            <el-row type="flex" align="middle" class="header-row" justify="start">
                <el-row type="flex" align="middle" class="title-panel" justify="start">
                    <img :src="logoUrl" class="logo" />
                    <el-row class="text">{{ title }}</el-row>
                </el-row>
                <!-- 插槽：菜单区域 -->
                <slot name="menu-content"></slot>
                <!-- 右上方区域 -->
                <el-row type="flex" align="middle" justify="end" class="setting-panel">
                    <!-- 插槽：设置区域 -->
                    <slot name="setting-content"></slot>
                    <img :src="avatarUrl" class="avatar">
                    <el-dropdown @command="handleUserCommand">
                        <span class="user-name">
                            {{ username }}<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <template #dropdown>
                            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                        </template>
                    </el-dropdown>
                </el-row>
            </el-row>
        </el-header>
        <el-main class="main-container">
            <!-- 插槽：主内容区域 -->
            <slot name="main-content"></slot>
        </el-main>
    </el-container>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
    title: String
})

const logoUrl = require('./asserts/logo.png')
const avatarUrl = require('./asserts/avatar.png')
const username = ref('薯片锅巴')
const handleUserCommand = function (event) {
    console.log(event);
}
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

            .setting-panel {
                margin-left: auto;
                min-width: 180px;

                .avatar {
                    margin-right: 12px;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                }

                .user-name {
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
