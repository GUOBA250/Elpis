<template>
    <header-container :title="projName">
        <template #menu-content>
            <!-- 根据 menuStore.menuList 渲染 -->
            <el-menu :default-active="activeKey" :ellipsis="false" mode="horizontal" @select="onMenuSelect">
                <template v-for="item in menuStore.menuList" :key="item.key">
                    <SubMenu v-if="item.subMenu && item.subMenu.length > 0" :menuItem="item"></SubMenu>
                    <el-menu-item :index="item.key" v-else>{{ item.name }}</el-menu-item>
                </template>
            </el-menu>
        </template>
        <template #setting-content>
            <!-- 根据 projStore.projectList 渲染-->
            <el-dropdown @command="handleProjectCommand">
                <span class="project-list">
                    {{ projName }}
                    <el-icon v-if="projectStore.projectList.length > 1">
                        <ArrowDown />
                    </el-icon>
                </span>
                <template v-if="projectStore.projectList.length > 1" #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item v-for="item in projectStore.projectList" :key="item.key" :command="item.key"
                            :disabled="item.name === projName">
                            {{ item.name }}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </template>
        <template #main-content></template>
    </header-container>
</template>

<script setup>
import headerContainer from '$widgets/header-container/header-container.vue'
import SubMenu from './complex-view/sub-menu/sub-menu.vue'
import { useMenuStore } from '@/stores/menu-store'
import { useProjectStore } from '@/stores/project-store'
import { ArrowDown } from '@element-plus/icons-vue'



const menuStore = useMenuStore()
const projectStore = useProjectStore()
defineProps({
    projName: {
        type: String,
        default: ''
    }
})

const handleProjectCommand = function (command) {
    projectStore.setProjectKey(command)
}
</script>



<style lang="less" scoped>
.project-list {
    margin-right: 20px;
    cursor: pointer;
    color: var(--el-color-primary);
    display: flex;
    align-items: center;
    outline: none;
}

:deep(.el-menu--horizontal.el-menu) {
    border-bottom: 0
}
</style>
