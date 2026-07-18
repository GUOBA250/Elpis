import { createApp } from 'vue'

// 引入 element-plus
import ElementPlus from 'element-plus'
import pinia from '../store'
import { createRouter, createWebHashHistory } from 'vue-router'
import 'element-plus/dist/index.css'
import '../asserts/custom.css'



/**
 * vue 页面主入口，用于启动 vue
 * @param pageComponent vue 入口组件
 * @param routes 路由配置
 * @param libs 插件配置
 */
export default (pageComponent, { routes, libs}) => {
    const app = createApp(pageComponent)

    // 应用
    app.use(ElementPlus)

    // 引入 pinia
    app.use(pinia)

    // 引入插件
    libs.forEach(lib => {
        app.use(lib)
    })

    // 页面路由
    if (routes && routes.length) {
        const router = createRouter({
            history: createWebHashHistory(), // 采用 hash 模式
            routes
        })
        app.use(router)
        router.isReady().then(() => {
            app.mount('#root')
        })
    } else {
        app.mount('#root')
    }
}
