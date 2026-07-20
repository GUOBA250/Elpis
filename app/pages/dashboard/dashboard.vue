<template>
    <el-config-provider locale="zh-cn">
        <header-view :projName="projName"></header-view>
    </el-config-provider>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import $curl from '../common/curl.js';
import { useProjectStore } from '../store/project.js';
import { useMenuStore } from '../store/menu.js';
import zhCN from 'element-plus/es/locale/lang/zh-cn'
import headerView from './complex-view/header-view/header-view.vue'

const projectStore = useProjectStore()
const menuStore = useMenuStore()

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
        query: {
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
        query: {
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

</script>

<style lang="less" scoped></style>
