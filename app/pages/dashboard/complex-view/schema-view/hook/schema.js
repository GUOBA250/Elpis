import { ref, watch, onMounted, nextTick } from "vue";
import { useRoute } from "vue-router";
import { useMenuStore } from "$elpisStore/menu.js";
import _ from "lodash";

export const useSchema = () => {
  const route = useRoute();
  const menuStore = useMenuStore();

  const api = ref("");
  const tableSchema = ref({});
  const tableConfig = ref();
  // 搜索 schema
  const searchSchema = ref({});
  const searchConfig = ref();
  // 动态组件
  const components = ref({});

  // 构造 schemaConfig 相关配置，输送给 schemaView 解析
  const buildData = function () {
    const { key, sider_key: siderKey } = route.query;

    const mItem = menuStore.findMenuItem({
      key: "key",
      value: siderKey ?? key,
    });
    if (mItem && mItem.schemaConfig) {
      const { schemaConfig: sConfig } = mItem;

      const configSchema = _.cloneDeep(sConfig.schema);

      api.value = sConfig.api;
      tableSchema.value = {};
      tableConfig.value = undefined;
      searchSchema.value = {};
      searchConfig.value = undefined;
      components.value = {};

      nextTick(() => {
        // table 相关配置
        tableSchema.value = buildDtoSchema(configSchema, "table");
        tableConfig.value = sConfig.tableConfig;
        // search 相关配置
        const dtoSearchSchema = buildDtoSchema(configSchema, "search");
        // 如果路由有参数，使用路由参数作为默认值
        for (const key in dtoSearchSchema.properties) {
          if (route.query[key] !== undefined) {
            dtoSearchSchema.properties[key].option.default = route.query[key];
          }
        }
        searchSchema.value = dtoSearchSchema;
        searchConfig.value = sConfig.searchConfig;
        // 动态组件数据构造 components => { comKey: { schema, config } }
        const { componentConfig } = sConfig;
        if (componentConfig && Object.keys(componentConfig).length > 0) {
          const dtoComponents = {};
          for (const comName in componentConfig) {
            dtoComponents[comName] = {
              // 例如：product_name 里面的 comAOption 进行转换
              schema: buildDtoSchema(configSchema, comName),
              // 这是动态组件的配置
              config: componentConfig[comName],
            };
          }
          components.value = dtoComponents;
        }
      });
    }
  };

  // 提取schema内想使用的具体配置, 让数据更精简准确，减少不相关的属性
  function buildDtoSchema(_schema, comName) {
    if (!_schema?.properties) return {};
    const dtoSchema = {
      type: "object",
      properties: {},
    };
    // 提取有效 schema 配置
    for (const key in _schema.properties) {
      const props = _schema.properties[key];
      if (props && props[`${comName}Option`]) {
        let dtoProps = {};
        for (const pKey in props) {
          if (pKey.indexOf("Option") >= 0) continue;
          dtoProps[pKey] = props[pKey];
        }
        // 处理 comName Option
        dtoProps = Object.assign({}, dtoProps, {
          option: props[`${comName}Option`],
        });
        // 处理 required 字段
        const { required } = _schema;
        if (required && required.find((pk) => pk === key)) {
          if (dtoProps.option) {
            dtoProps.option.required = true;
          }
        }
        dtoSchema.properties[key] = dtoProps;
      }
    }
    return dtoSchema;
  }

  watch(
    [
      () => route.query.key,
      () => route.query.sider_key,
      () => menuStore.menuList,
    ],
    () => {
      buildData();
    },
    {
      deep: true,
    }
  );

  onMounted(() => {
    buildData();
  });

  return {
    api,
    tableSchema,
    tableConfig,
    searchSchema,
    searchConfig,
    components,
  };
};
