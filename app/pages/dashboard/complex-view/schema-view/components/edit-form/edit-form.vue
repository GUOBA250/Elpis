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
      <schema-form
        v-loading="loading"
        ref="schemaFormRef"
        :schema="components[name]?.schema"
        :model="dtoModel"
      ></schema-form>
    </template>
    <template #footer>
      <el-button type="primary" @click="save">{{ saveBtnText }}</el-button>
    </template>
  </el-drawer>
</template>

<script setup>
import { inject, ref } from "vue";
import { ElNotification } from "element-plus";
import $curl from "$elpisCommon/curl";
import SchemaForm from "$elpisWidgets/schema-form/schema-form";

const { api, components } = inject("schemaViewData");

const emit = defineEmits(["command"]);

const name = ref("editForm");

const loading = ref(false);
const isShow = ref(false);
const title = ref("");
const saveBtnText = ref("");
const mainKey = ref("");
const mainValue = ref();
const dtoModel = ref({});
const schemaFormRef = ref(null);

const show = (rowData) => {
  const config = components.value?.[name.value]?.config;
  if (!config) return;

  title.value = config.title;
  saveBtnText.value = config.saveBtnText;
  mainKey.value = config.mainKey; // 表单主键
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

const save = async () => {
  if (loading.value) return;
  const { validate } = schemaFormRef.value || {};
  if (!(typeof validate === "function" && validate())) {
    return;
  }
  loading.value = true;
  const res = await $curl({
    method: "put",
    url: api.value,
    data: {
      [mainKey.value]: mainValue.value,
      ...schemaFormRef.value.getValue(),
    },
  });
  loading.value = false;

  if (!res || !res.success) {
    return;
  }

  ElNotification({
    message: "修改成功",
    type: "success",
  });
  close();
  emit("command", {
    event: "loadTableData",
  });
};

defineExpose({
  name,
  show,
});
</script>

<style lang="less" scoped></style>
