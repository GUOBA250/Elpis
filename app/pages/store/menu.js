import { defineStore } from "pinia";
import { ref } from "vue";

export const useMenuStore = defineStore("menu", () => {
  // 菜单列表
  const menuList = ref([]);

  // 设置 menu 配置
  const setMenuList = function (list) {
    menuList.value = list;
  };

  /**
   * 找出菜单目录配置
   * @param key 按照哪个字段查找
   * @param value 搜索值
   * @param {*} list 搜索列表数据
   * @returns
   */
  const findMenuItem = ({ key, value }, mList = menuList.value) => {
    for (let i = 0; i < mList.length; i++) {
      const menuItem = mList[i];
      if (!menuItem) {
        continue;
      }
      if (menuItem[key] === value) {
        return menuItem;
      }
      const { menuType, moduleType } = menuItem;
      // 如果菜单有子菜单列表，继续查找subMenu
      if (menuType === "group" && menuItem.subMenu) {
        const mItem = findMenuItem({ key, value }, menuItem.subMenu);
        if (mItem) {
          return mItem;
        }
      }
      // 侧边栏也有路由配置，因此也要查找是否有匹配路径
      if (
        moduleType === "sider" &&
        menuItem.siderConfig &&
        menuItem.siderConfig.menu
      ) {
        const mItem = findMenuItem({ key, value }, menuItem.siderConfig.menu);
        if (mItem) {
          return mItem;
        }
      }
    }
  };
  /**
   * 找出第一个可用的菜单项
   * @param mList
   */
  const findFirstMenuItem = function (mList = menuList.value) {
    if (!mList || !mList.length) {
      return;
    }
    let firstMenuItem = mList[0];
    if (firstMenuItem.subMenu) {
      firstMenuItem = findFirstMenuItem(firstMenuItem.subMenu);
    }
    return firstMenuItem;
  };

  return {
    menuList,
    setMenuList,
    findMenuItem,
    findFirstMenuItem,
  };
});
