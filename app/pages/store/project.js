import { defineStore } from "pinia";
import { ref } from "vue";

export const useProjectStore = defineStore("project", () => {
  // 菜单列表
  const projectList = ref([]);

  // 设置 project 配置
  const setProjectList = function (list) {
    projectList.value = list;
  };
  return {
    projectList,
    setProjectList,
  };
});
