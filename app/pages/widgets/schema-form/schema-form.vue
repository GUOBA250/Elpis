<template>
  <el-row v-if="schema && schema.properties" class="schema-form">
    <template v-for="(itemSchema, key) in schema.properties">
      <component
        :is="FormItemConfig[itemSchema.option?.comType]?.component"
        v-show="itemSchema.option.visible !== false"
        ref="formComList"
        :schema-key="key"
        :schema="itemSchema"
        :model="model ? model[key] : undefined"
      />
    </template>
  </el-row>
</template>

<script setup>
import { ref, toRefs, provide } from "vue";
import FormItemConfig from "./form-item-config";

const Ajv = require("ajv");
const ajv = new Ajv();

provide("ajv", ajv);

const formComList = ref([]);

const props = defineProps({
  /**
   * schema 配置结构如下：
    {
      type: "object",
      properties: {
        key: {
          ...schema, // 标准 schema 配置
          type: "", // 字段类型
          label: "", // 标签
          // 控件配置
          option: {
            ...eleComponentConfig, // 标准 ele 组件配置
            comType: "", // 控件类型 input、select、radio、checkbox...
            required: false, // 是否必填，默认为false
            visible: true, // 是否显示，默认为true
            disabled: false, // 是否禁用，默认为false
            default: "", // 默认值
            // comType 为 select 时的配置
            enumList: [], // 枚举列表
          },
        },
        // other key
      },
    };
   */
  schema: Object,
  // 表单数据回填
  model: Object,
});

const { schema, model } = toRefs(props);

// 表单校验
const validate = () => {
  return formComList.value.every((item) => {
    const res = item.validate();
    return res;
  });
};
// 获取表单数据
const getValue = () => {
  return formComList.value.reduce(
    (dtoObj, item) => ({ ...dtoObj, ...item.getValue() }),
    {}
  );
};

defineExpose({
  validate,
  getValue,
});
</script>

<style lang="less">
.schema-form {
  .form-item {
    margin-bottom: 20px;
    min-width: 500px;

    .item-label {
      margin-right: 15px;
      min-width: 70px;
      text-align: right;
      font-size: 14px;
      color: #ffffff;
      word-break: break-all;

      .required {
        top: 2px;
        padding-left: 4px;
        color: #f56c6c;
        font-size: 20px;
      }
    }

    .item-value {
      .component {
        width: 320px;
      }
      .valid-border {
        .el-input__wrapper {
          border: 1px solid #f93f3f;
          box-shadow: 0 0 0 0;
        }
        .el-select__wrapper {
          border: 1px solid #f93f3f;
          box-shadow: 0 0 0 0;
        }
      }
    }
    .valid-tips {
      margin-left: 10px;
      height: 36px;
      line-height: 36px;
      overflow: hidden;
      font-size: 12px;
      color: #f93f3f;
    }
  }
}
</style>
