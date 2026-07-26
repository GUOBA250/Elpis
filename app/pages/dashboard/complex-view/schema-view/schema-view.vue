<template>
    <el-row class="schema-view">
        <search-panel></search-panel>
        <table-panel></table-panel>
    </el-row>
</template>

<script setup>
import SearchPanel from './complex-view/search-panel/search-panel.vue'
import TablePanel from './complex-view/table-panel/table-panel.vue'
import { useSchema } from './hook/schema.js'

const { api } = useSchema()
</script>

<style scoped lang="less">
.schema-view {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
}
</style>
