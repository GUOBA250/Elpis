<template>
  <el-row class="schema-view">
    <search-panel
      v-if="
        searchSchema?.properties &&
        Object.keys(searchSchema.properties).length > 0
      "
      @search="onSearch"
    ></search-panel>
    <table-panel @operate="onTableOperate" ref="tablePanelRef"></table-panel>
    <component
      :is="ComponentConfig[key]?.component"
      v-for="(item, key) in components"
      :key="key"
      ref="comListRef"
      @command="onComponentCommand"
    ></component>
  </el-row>
</template>

<script setup>
import { provide, ref } from "vue";
import SearchPanel from "./complex-view/search-panel/search-panel.vue";
import tablePanel from "./complex-view/table-panel/table-panel.vue";
import { useSchema } from "./hook/schema.js";
import ComponentConfig from "./components/component-config.js";

const {
  api,
  tableSchema,
  tableConfig,
  searchSchema,
  searchConfig,
  components,
} = useSchema();

const apiParams = ref({});

const comListRef = ref([]);
const tablePanelRef = ref(null);

provide("schemaViewData", {
  api,
  apiParams,
  tableSchema,
  tableConfig,
  searchSchema,
  searchConfig,
  components,
});

const onSearch = (searchValObj) => {
  apiParams.value = searchValObj;
};

const showComponent = ({ btnConfig, rowData }) => {
  const { comName } = btnConfig.eventOption;

  if (!comName) return;
  const comRef = comListRef.value.find((item) => {
    return item.name === comName;
  });

  if (!comRef || typeof comRef.show !== "function") return;

  comRef.show(rowData);
};

// table 事件映射
const EventHandleMap = {
  showComponent,
};

const onTableOperate = ({ btnConfig, rowData }) => {
  const { eventKey } = btnConfig;
  if (EventHandleMap[eventKey]) {
    EventHandleMap[eventKey]({ btnConfig, rowData });
  }
};

const onComponentCommand = (data) => {
  const { event } = data
  if (event === 'loadTableData') {
    tablePanelRef.value.loadTableData()
  }
};
</script>

<style lang="less" scoped>
.schema-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}
</style>
