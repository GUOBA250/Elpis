import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProjectStore = defineStore('project', () => {
    const projectList = ref([])
    const projectKey = ref('')

    const setProjectList = function (list) {
        projectList.value = list
    }

    const setProjectKey = function (key) {
        projectKey.value = key
    }

    return {
        projectList,
        projectKey,
        setProjectList,
        setProjectKey
    }
})
