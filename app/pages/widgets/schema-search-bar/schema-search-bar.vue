<template>
  <el-form
    v-if="schema && schema.properties"
    :inline="true"
    class="schema-search-bar"
  >
    <!-- 动态组件: 查询条件 -->
    <el-form-item
      v-for="(schemaItem, key) in schema.properties"
      :key="key"
      :label="schemaItem.label"
    >
      <!-- 子组件 -->
      <component
        :is="SearchItemConfig[schemaItem?.option?.comType]?.component"
        ref="searchComList"
        :schema-key="key"
        :schema="schemaItem"
        @loaded="handleChildLoaded"
      />
    </el-form-item>
    <!-- 搜查、重置按钮 -->
    <el-form-item>
      <el-button type="primary" plain class="search-btn" @click="search">
        <span>查询</span>
      </el-button>
      <el-button plain class="reset-btn" @click="reset">
        <span>重置</span>
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { toRefs, ref } from "vue";
import SearchItemConfig from "./search-item-config.js";

const props = defineProps({
  /**
   * 配置结构如下
        schema: {
          type: "object",
          properties: {
            key: {
              ...schema,
              type: "",
              label: "",
              option: {
                // ...eleComponentConfig,
                // comType: "", // 组件类型
                // default: '', // 默认值
              },
            },
            ...
          },
        },
   */
  schema: Object,
});
const { schema } = toRefs(props);
const emit = defineEmits(["load", "search", "reset"]);

const searchComList = ref([]);

const getValue = () => {
  let dtoObj = {};
  searchComList.value.forEach((comp) => {
    dtoObj = { ...dtoObj, ...comp?.getValue() };
  });
  return dtoObj;
};

let childComLoadedCount = 0;
const handleChildLoaded = () => {
  childComLoadedCount++;
  if (childComLoadedCount >= Object.keys(schema.value.properties).length) {
    emit("load", getValue());
  }
};

const search = () => {
  emit("search", getValue());
};

const reset = () => {
  searchComList.value.forEach((comp) => comp?.reset());
  emit("reset");
};

defineExpose({
  search,
  reset,
  getValue,
});
</script>

<!-- 不用scoped，在顶层维护子组件的样式 -->
<style lang="less">
.schema-search-bar {
  min-width: 500px;

  .input,
  .select,
  .dynamic-select {
    width: 180px;
  }

  .search-btn {
    width: 100px;
  }
  .reset-btn {
    width: 100px;
  }
}
</style>
