<template>
  <div class="schema-table">
    <el-table
      v-if="schema && schema.properties"
      v-loading="loading"
      :data="tableData"
      class="table"
    >
      <template v-for="(schemaItem, key) in schema.properties">
        <el-table-column
          v-if="schemaItem.option?.visible !== false"
          :key="key"
          :prop="key"
          :label="schemaItem.label"
          v-bind="schemaItem.option"
        ></el-table-column>
      </template>
      <el-table-column
        v-if="buttons && buttons.length"
        label="操作"
        fixed="right"
        :width="operationWidth"
      >
        <template #default="scope">
          <el-button
            v-for="(item, index) in buttons"
            :key="index"
            link
            v-bind="item"
            @click="handleButtonClick({ btnConfig: item, rowData: scope.row })"
          >
            {{ item.label }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="pagination" justify="end">
      <el-pagination
        background
        :current-page="currentPage"
        layout="prev, pager, next, jumper"
        :total="total || 0"
        :page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      ></el-pagination>
    </el-row>
  </div>
</template>

<script setup>
import { ref, toRefs, watch, nextTick, onMounted, onUnmounted, computed } from "vue";
import $curl from "$elpisCommon/curl";
import { isNumber } from "lodash";

const props = defineProps({
  /**
   * 表格数据源 使用RESTFul API（get、post、put、delete...）
   */
  api: String,
  /** 表格查询参数 */
  apiParams: Object,
  /**
   * 表格列配置
   * {
   *   type: "object",
   *   properties: {
   *     key: {
   *       label: "列名",
   *       type: "string",
   *       option: {}
   *    }
   *   }
   * }
   */
  schema: Object,
  /**
   * 操作按钮配置
   */
  buttons: Array,
});

const emit = defineEmits(["operate"]);

const handleButtonClick = ({ btnConfig, rowData }) => {
  emit("operate", {
    btnConfig,
    rowData,
  });
};

const { api, schema, buttons, apiParams } = toRefs(props);

const loading = ref(false);
const tableData = ref([]);
const currentPage = ref(1);
const pageSize = ref(50);
const total = ref(0);

onMounted(() => {
  initData();
});

// 动态估算操作栏宽度
const operationWidth = computed(() => {
  const btnList = buttons?.value;
  if (!btnList?.length) return 50;
  return btnList.reduce((width, cur) => {
    return width + (cur?.label?.length ?? 0) * 18;
  }, 50);
});

watch(
  () => [api, schema, apiParams],
  async () => {
    await loadTableData();
  },
  { deep: true }
);

let timerId = null;
const loadTableData = async () => {
  clearTimeout(timerId);
  timerId = setTimeout(async () => {
    await fetchTableData();
    timerId = null;
  }, 100);
};

// 组件卸载时清理防抖定时器，避免卸载后仍发起请求/写状态
onUnmounted(() => {
  clearTimeout(timerId);
});

const initData = () => {
  currentPage.value = 1;
  pageSize.value = 50;
  nextTick(async () => {
    await loadTableData();
  });
};

async function fetchTableData() {
  if (!api.value) return;
  showLoading();
  // 请求table数据
  const res = await $curl({
    method: "get",
    url: `${api.value}/list`,
    query: {
      ...apiParams.value,
      page: currentPage.value,
      size: pageSize.value,
    },
  });
  hideLoading();

  if (!res || !res.success || !Array.isArray(res.data)) {
    tableData.value = [];
    total.value = 0;
    return;
  }
  tableData.value = buildTableData(res.data);
  total.value = res.metadata?.total;
}

/**
 * 数据预处理
 * @param data
 */
const buildTableData = (listData) => {
  if (!schema.value?.properties) {
    return listData;
  }

  return listData.map((rowData) => {
    for (const dKey in rowData) {
      const schemaItem = schema.value.properties[dKey];
      if (schemaItem?.option?.toFixed && isNumber(rowData[dKey])) {
        rowData[dKey] = rowData[dKey].toFixed(schemaItem.option.toFixed);
      }
    }
    return rowData;
  });
};

const showLoading = () => {
  loading.value = true;
};

const hideLoading = () => {
  loading.value = false;
};

const handleCurrentChange = async (val) => {
  currentPage.value = val;
  await loadTableData();
};

const handleSizeChange = async (val) => {
  pageSize.value = val;
  await loadTableData();
};

defineExpose({
  initData,
  loadTableData,
  showLoading,
  hideLoading,
});
</script>

<style lang="less" scoped>
.schema-table {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: auto;
  height: 100%;
  width: 100%;

  .table {
    flex: 1;
  }

  .pagination {
    margin: 10px 0;
    text-align: right;
  }
}
</style>
