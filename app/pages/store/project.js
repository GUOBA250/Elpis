import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProjectStore = defineStore('project', () => {
    // 项目数据
    const projectList = ref([])

    // 设置项目数据
    const setProjectList = function (list) {
        projectList.value = list
    }
    return {
        projectList,
        setProjectList
    }
    
})
