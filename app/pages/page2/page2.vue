<template>
    <h1>Page1</h1>
    <input v-model="content" />
    <div>
        {{ content }}
    </div>
</template>

<script setup>
import { ref } from 'vue'
const content = ref('')
console.log('page2 init');

</script>

<style lane="less" scoped>
h1 {
    color: blue;
}
</style>