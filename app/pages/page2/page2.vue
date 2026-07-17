<template>
    <h1>Page2</h1>
    <el-input v-model="content" placeholder="请输入内容" style="width: 150px;" />
    <div>
        {{ content }}
    </div>
</template>

<script setup>
import { ref } from 'vue'
const content = ref('')
console.log('page2 init');

</script>

<style lang="less" scoped>
h1 {
    color: blue;
}
</style>