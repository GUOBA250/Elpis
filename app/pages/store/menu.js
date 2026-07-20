import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMenuStore = defineStore('menu', () => {
    // 菜单数据
    const menuList = ref([])

    // 设置菜单数据
    const setMenuList = function (list) {
        menuList.value = list
    }
    return {
        menuList,   
        setMenuList
    }
    
})
