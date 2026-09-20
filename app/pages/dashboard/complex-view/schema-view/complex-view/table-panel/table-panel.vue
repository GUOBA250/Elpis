<template>
  <el-card class="table-panel">
    <!-- 头部操作栏 -->
    <el-row v-if="tableConfig?.headerButtons?.length" justify="end" class="operation-panel">
      <el-button
        v-for="item in tableConfig.headerButtons"
        v-bind="item"
        @click="handleOperation({ btnConfig: item })"
      >
        {{ item.label }}
      </el-button>
    </el-row>
    <!-- 表格模版渲染 -->
    <schema-table
      ref="schemaTableRef"
      :buttons="tableConfig?.rowButtons ?? []"
      :api="api"
      :api-params="apiParams"
      :schema="tableSchema"
      @operate="handleOperation"
    >
    </schema-table>
  </el-card>
</template>

<script setup>
import { ref, inject } from 'vue'
import $curl from '$elpisCommon/curl'
import { ElMessageBox, ElNotification } from 'element-plus'
import SchemaTable from '$elpisWidgets/schema-table/schema-table.vue'

const { api, apiParams, tableSchema, tableConfig } = inject('schemaViewData')

const emit = defineEmits(['operate'])

const schemaTableRef = ref(null)

const EventHandlerMap = {
  remove: removeData
}

const handleOperation = async ({ btnConfig, rowData }) => {
  const { eventKey } = btnConfig || {}

  if (EventHandlerMap[eventKey]) {
    EventHandlerMap[eventKey]({ btnConfig, rowData })
  } else {
    emit('operate', { btnConfig, rowData })
  }
}

async function removeData({ btnConfig, rowData }) {
  const { eventOption } = btnConfig
  if (!eventOption?.params) {
    return
  }
  const { params } = eventOption
  const removeKey = Object.keys(params)[0]

  let removeValue

  const removeValueList = params[removeKey].split('::')
  if (removeValueList[0] === 'schema' && removeValueList[1]) {
    removeValue = rowData[removeValueList[1]]
  }

  ElMessageBox.confirm(`确定删除 ${removeKey} 为：${removeValue} 数据?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      schemaTableRef.value.showLoading()
      const res = await $curl({
        method: 'delete',
        url: api.value,
        data: {
          [removeKey]: removeValue
        },
        errorMessage: '删除失败'
      })
      schemaTableRef.value.hideLoading()

      // DELETE 接口通常无响应体，只要业务成功即视为删除成功
      if (!res || !res.success) {
        return
      }

      ElNotification({
        title: '删除成功',
        message: '删除成功',
        type: 'success'
      })

      await initTableData()
    })
    .finally(() => {
      schemaTableRef.value.hideLoading()
    })
}

const loadTableData = async () => {
  await schemaTableRef.value.loadTableData()
}
const initTableData = async () => {
  await schemaTableRef.value.initData()
}

defineExpose({
  loadTableData,
  initTableData
})
</script>

<style lang="less" scoped>
.table-panel {
  margin: 10px;
  flex: 1;

  .operation-panel {
    margin-bottom: 10px;
  }
}

:deep(.el-card__body) {
  height: 98%;
  display: flex;
  flex-direction: column;
}
</style>
