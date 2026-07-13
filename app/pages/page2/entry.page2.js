import { createApp } from 'vue'
import Page2 from './page2.vue'
const app = createApp(Page2)
import utils from '$common/utils'
app.use(utils)
app.mount('#root')
