<template>
  <el-drawer
    v-model="isShow"
    direction="rtl"
    :size="550"
    :destroy-on-close="true"
  >
    <template #header>
      <h3>{{ title }}</h3>
    </template>
    <template #default>
      <el-card v-loading="loading" shadow="always" class="detail-panel">
        <el-row
          v-for="(item, key) in components[name]?.schema?.properties"
          :key="key"
          type="flex"
          align="flex-start"
          class="row-item"
        >
          <el-row class="item-label">{{ item.label }}：</el-row>
          <el-row class="item-value">{{ dtoModel[key] }}</el-row>
        </el-row>
      </el-card>
    </template>
    <template #footer>
      <el-button type="default" @click="close">关闭</el-button>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref, inject } from "vue";
import $curl from "$elpisCommon/curl.js";

const name = ref("detailPanel");

const { api, components } = inject("schemaViewData");

const isShow = ref(false);
const loading = ref(false);
const title = ref("");
const mainKey = ref("");
const mainValue = ref();
const dtoModel = ref({});

const show = (rowData) => {
  const config = components.value?.[name.value]?.config;
  if (!config) return;

  title.value = config.title;
  mainKey.value = config.mainKey;
  mainValue.value = rowData?.[config.mainKey];
  dtoModel.value = {};
  isShow.value = true;

  fetchFormData();
};

const fetchFormData = async () => {
  if (loading.value) return;
  loading.value = true;
  const res = await $curl({
    method: "get",
    url: api.value,
    query: {
      [mainKey.value]: mainValue.value,
    },
  });
  loading.value = false;

  if (!res || !res.success || !res.data) {
    return;
  }

  dtoModel.value = res.data;
};

const close = () => {
  isShow.value = false;
};

defineExpose({
  name,
  show,
});
</script>

<style lang="less" scoped>
.detail-panel {
  border: 1px solid #a6a6a6;
  padding: 20px;
  .row-item {
    line-height: 1.5em;
    font-size: 14px;
    padding-bottom: 20px;
    .item-label {
      margin-right: 20px;
      width: 90px;
      color: #fff;
    }

    .item-value {
      color: #d2dae4;
      display: block;
      white-space: wrap;
      word-break: break-all;
      flex: 1;
    }
  }
}
</style>
