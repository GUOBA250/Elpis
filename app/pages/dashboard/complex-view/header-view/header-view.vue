<template>
    <header-container :title="projName">
        <template #menu-content>
            <!-- 根据 menuStore.menuList 渲染 -->
            <el-menu :default-active="activeKey" :ellipsis="false" mode="horizontal" @select="onMenuSelect">
                <template v-for="item in menuStore.menuList" :key="item.key">
                    <sub-menu v-if="item.subMenu && item.subMenu.length > 0" :menuItem="item"></sub-menu>
                    <el-menu-item :index="item.key" v-else>{{ item.name }}</el-menu-item>
                </template>
            </el-menu>
        </template>
        <template #setting-content>
            <!-- 根据 projStore.projectList 渲染-->
            <el-dropdown @command="handleProjectCommand">
                <span class="project-list">
                    {{ projName }}
                    <span v-if="projectStore.projectList.length > 1" class="arrow-icon">▼</span>
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
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import HeaderContainer from '$widgets/header-container/header-container.vue'
import SubMenu from './complex-view/sub-menu/sub-menu.vue'
import { useMenuStore } from '$store/menu.js'
import { useProjectStore } from '$store/project.js'

const props = defineProps({
    projName: {
        type: String,
        default: ''
    }
})

const route = useRoute()
const router = useRouter()
const menuStore = useMenuStore()
const projectStore = useProjectStore()

const activeKey = ref('')

const emit = defineEmits(['menu-select'])

watch(() => route.query.key, () => {
    setActiveKey()
})

watch(() => menuStore.menuList, () => {
    setActiveKey()
})

onMounted(() => {
    setActiveKey()
})

const setActiveKey = function () {
    const menuItem = menuStore.findMenuItem({
        key: 'key',
        value: route.query.key
    })
    activeKey.value = menuItem?.key
}

const onMenuSelect = function (menuKey) {
    const menuItem = menuStore.findMenuItem({
        key: 'key',
        value: menuKey
    })
    emit('menu-select', menuItem)
    setActiveKey()
}

const handleProjectCommand = function (event) {
    const projectItem = projectStore.projectList.find(item => item.key === event)
    if (!projectItem || !projectItem.homePage) {
        return
    }
    const { origin, pathname } = window.location
    window.location.replace(`${origin}${pathname}#${projectItem.homePage}`)
    window.location.reload()
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

    .arrow-icon {
        margin-left: 4px;
        font-size: 12px;
    }
}

:deep(.el-menu--horizontal.el-menu) {
    border-bottom: 0
}
</style>
