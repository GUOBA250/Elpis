import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useMenuStore } from '$store/menu.js'

export const useSchema = function() {
    const route = useRoute()
    const menuStore = useMenuStore()

    const api = ref(null)

    // 构造 schemaConfig 相关配置，输送给 schemaView 解释
    const buildData = function() {
        const { key, sider_key } = route.query
        const mItem = menuStore.findMenuItem({
            key: 'key',
            value: sider_key ? sider_key : key
        })
        if(mItem && mItem.schemaConfig) {
            const { schemaConfig: sConfig } = mItem
            api.value = sConfig.api ? import(sConfig.api) : null
        }
    }

    watch([
        () => route.query.key,
        () => route.query.sider_key,
        () => menuStore.menuList
    ], () => {
        buildData()
    }, {
        deep: true
    })

    onMounted(() => {
        buildData()
    })

    return {
        api
    }
}