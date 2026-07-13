<template>
    <div class="page1-container">
        <h1>Page1</h1>
        <input v-model="content" placeholder="请输入内容" />
        <div>
            {{ content }}
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import utils from '$common/utils'

const content = ref('')
console.log('page1 init');

</script>

<style lang="less" scoped>
.page1-container {
    min-height: 100vh;
    padding: 20px;
}
h1 {
    color: red;
}
</style>