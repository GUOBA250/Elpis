<template>
    <sider-container>
        <template #menu-content>
            <el-menu :default-active="activeKey" @select="onMenuSelect" :ellipsis="false">
                <template v-for="item in menuList">
                    <sub-menu v-if="item.subMenu && item.subMenu.length > 0" :menu-item="item"></sub-menu>
                    <el-menu-item v-else :index="item.key"></el-menu-item>
                </template>
            </el-menu>
        </template>
        <template #main-content>
            <router-view />
        </template>
    </sider-container>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMenuStore } from '$store/menu.js'
import SiderContainer from '$widgets/sider-container/sider-container.vue'
import SubMenu from '$widgets/sub-menu/sub-menu.vue'

const activeKey = ref('')
const router = useRouter()
const route = useRoute()
const menuStore = useMenuStore()
const menuList = ref(menuStore.menuList)

const setActiveKey = function () {
    let siderMenuItem = menuStore.findMenuItem({
        key: 'key',
        value: route.query.sider_key
    })

    // 如果首次加载 sider-view，用户未选中左侧菜单，需要默认选中第一个
    if (!siderMenuItem) {
        const hMenuItem = menuStore.findMenuItem({
            key: 'key',
            value: route.query.key
        })
        if (hMenuItem && hMenuItem.siderConfig && hMenuItem.siderConfig.menu) {
            const sideMenu = hMenuItem.siderConfig.menu
            siderMenuItem = menuStore.findFirstMenuItem(sideMenu) // 找出左侧菜单中的第一项
            if (siderMenuItem) {
                handleMenuSelect(siderMenuItem.key)
            }
        }
    }

    activeKey.value = siderMenuItem?.key
}
const setMenuList = function () {
    const menuItem = menuStore.findMenuItem({
        key: 'key',
        value: route.query.key
    })
    if (menuItem && menuItem.siderConfig && menuItem.siderConfig.menu) {
        menuList.value = menuItem.siderConfig.menu
    }
}

watch(() => route.query.key, () => {
    setActiveKey()
    setMenuList()
})
watch(() => menuStore.menuList, () => {
    setActiveKey()
    setMenuList()
})
onMounted(() => {
    setMenuList()
    setActiveKey()
})

const onMenuSelect = function (menuKey) {
    handleMenuSelect(menuKey)
}

const handleMenuSelect = function (menuKey) {
    const menuItem = menuStore.findMenuItem({
        key: 'key',
        value: menuKey
    })

    if (!menuItem) {
        return
    }

    const { moduleType, key, customConfig } = menuItem

    // 如果是当前页面，不处理
    if (key === route.query.sider_key) {
        return
    }

    const pathMap = {
        iframe: '/iframe',
        schema: '/schema',
        custom: customConfig?.path
    }
    router.push({
        path: `/sider${pathMap[moduleType]}`,
        query: {
            key: route.query.key,
            sider_key: key,
            proj_key: route.query.proj_key,
        }
    })
}

</script>

<style scoped lang="less"></style>
