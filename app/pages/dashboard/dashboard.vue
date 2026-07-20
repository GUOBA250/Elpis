<template>
    <el-config-provider :locale="zhCN">
        <header-view :projName="projName" @menu-select="onMenuSelect">
            <template #main-content>
                <router-view></router-view>
            </template>
        </header-view>
    </el-config-provider>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import $curl from '$common/curl.js';
import { useProjectStore } from '$store/project.js';
import { useMenuStore } from '$store/menu.js';
import zhCN from 'element-plus/es/locale/lang/zh-cn'
import headerView from './complex-view/header-view/header-view.vue'

const projectStore = useProjectStore()
const menuStore = useMenuStore()
const router = useRouter()
const route = useRoute()

onMounted(() => {
    getProjectList()
    getProjectConfig()
})

const projName = ref('')

// 请求 /api/project/list 接口，并填充到 project-store中
async function getProjectList() {
    const res = await $curl({
        method: 'GET',
        url: '/api/project/list',
        params: {
            // TODO: 动态获取当前项目key，暂时先写死 pdd
            project_key: 'pdd',
        }
    })

    if (!res || !res.success || !res.data) {
        return
    }

    projectStore.setProjectList(res.data)
}


// 请求 project 接口
async function getProjectConfig() {
    const res = await $curl({
        method: 'GET',
        url: '/api/project',
        params: {
            // TODO: 动态获取当前项目key，暂时先写死 pdd
            proj_key: 'pdd',
        }
    })

    if (!res || !res.success || !res.data) {
        return
    }

    projName.value = res.data.name
    menuStore.setMenuList(res.data.menu)
}

// 点击菜单回调方法
const onMenuSelect = function (menuItem) {
    const { moduleType, key, customConfig } = menuItem

    // 如果是当前页面，不处理
    if (key === route.query.key) {
        return
    }
    const pathMap = {
        sider: '/sider',
        iframe: '/iframe',
        schema: '/schema',
        custom: customConfig?.path
    }
    router.push({
        path: pathMap[moduleType],
        query: {
            key,
            proj_key: route.query.proj_key
        }
    })
}

</script>

<style lang="less" scoped></style>
