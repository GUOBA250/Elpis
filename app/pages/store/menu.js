import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMenuStore = defineStore('menu', () => {
    // 菜单数据
    const menuList = ref([])

    // 设置菜单数据
    const setMenuList = function (list) {
        menuList.value = list
    }

    // 找出菜单目录
    const findMenuItem = function ({ key, value }, mList = menuList.value) {
        for (let i = 0; i < mList.length; i++) {
            const menuItem = mList[i]
            if (!menuItem) { continue }
            const { menuType, moduleType } = menuItem
            if (menuItem[key] === value) {
                return menuItem
            }
            if (menuType === 'group' && menuItem.subMenu) {
                const mItem = findMenuItem({ key, value }, menuItem.subMenu)
                if (mItem) {
                    return mItem
                }
            }
            if (moduleType === 'sider' && menuItem.siderConfig && menuItem.siderConfig.menu) {
                const mItem = findMenuItem({ key, value }, menuItem.siderConfig.menu)
                if (mItem) {
                    return mItem
                }
            }
        }
    }

    /**
     * 找出第一个菜单目录（深度优先查找第一个叶子节点）
     * @param mList 菜单列表
     */
    const findFirstMenuItem = function (mList = menuList.value) {
        if (!mList || mList.length === 0) { return }
        const firstMenuItem = mList[0]
        // 如果有子菜单，递归查找第一个叶子节点
        if (firstMenuItem.subMenu && firstMenuItem.subMenu.length > 0) {
            return findFirstMenuItem(firstMenuItem.subMenu)
        }
        return firstMenuItem
    }

    return {
        menuList,
        setMenuList,
        findFirstMenuItem,
        findMenuItem
    }

})
