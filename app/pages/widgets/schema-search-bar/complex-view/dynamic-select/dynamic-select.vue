<template>
  <el-select v-model="dtoValue" v-bind="schema.option" class="dynamic-select">
    <el-option
      v-for="item in enumList"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    ></el-option>
  </el-select>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import $curl from '$elpisCommon/curl';

const { schemaKey, schema } = defineProps({
  schemaKey: String,
  schema: Object
});
const emit = defineEmits(['loaded']);

const dtoValue = ref();
const getValue = () => {
  return dtoValue.value !== undefined
    ? {
        [schemaKey]: dtoValue.value
      }
    : {};
};

const enumList = ref([]);

const fetchEnumList = async () => {
  const res = await $curl({
    method: 'get',
    url: schema.option?.api,
    query: {}
  });
  // 仅在业务成功且返回数组时填充枚举列表
  if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
    enumList.value.push(...res.data);
  }
};

const reset = () => {
  dtoValue.value = schema?.option?.default ?? enumList.value?.[0]?.value;
};

onMounted(async () => {
  await fetchEnumList();
  reset();
  emit('loaded');
});

defineExpose({
  getValue,
  reset
});
</script>

<style lang="less" scoped></style>
