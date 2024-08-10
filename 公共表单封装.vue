<template>
  <div class="table-search-root">
    <el-form
      ref="searchForm"
      class="table-search__form"
      :model="formData"
      size="default"
      label-width="128px"
      v-bind="formProps"
    >
      <!-- 查询表单模块 -->
      <el-row class="table-search__row">
        <el-col
          v-for="(field, index) in fields"
          :key="field.prop"
          class="table-search__col"
          :class="{ 'form__item--hidden': shouldCollapse(index) }"
          :xl="6"
          :lg="8"
          :md="12"
          :sm="24"
        >
          <el-form-item :label="field.label" :prop="field.prop">
            <slot v-if="$slots[field.prop]" :name="field.prop"></slot>

            <component
              v-else
              :is="field.type"
              v-model.trim="formData[field.prop]"
              :placeholder="defaultPlaceHolder(field)"
              v-bind="getFormFieldProps(field.type, field.props)"
            >
              <template v-if="field.type === FieldsType.SELECT">
                <el-option
                  v-for="option in field.options"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </template>
            </component>
          </el-form-item>
        </el-col>

        <!-- 操作按钮模块 -->
        <div class="table-search__btns">
          <el-button
            type="primary"
            :loading="props.loading"
            @click="handleSearch"
          >
            查询
          </el-button>
          <el-button :loading="props.loading" @click="handleReset">
            重置
          </el-button>
          <span
            v-if="showCollapseBtn"
            class="table-search__btn--filter ml-28"
            @click="toggleCollapse"
          >
            {{ isCollapse ? "展开" : "收起" }}
            <el-icon color="#c0c4cc" v-show="isCollapse"
              ><CaretBottom
            /></el-icon>
            <el-icon color="#c0c4cc" v-show="!isCollapse"><CaretTop /></el-icon>
          </span>
        </div>
      </el-row>
    </el-form>
  </div>
</template>
<script lang="ts">
// 解决组件不渲染问题---使用的是自动引入方式，不知为何有bug，暂时只能用这种方式解决，有好办法的也可以分享一下
import {
  ElInput,
  ElInputNumber,
  ElSelect,
  ElTimePicker,
  ElTimeSelect,
  ElDatePicker,
} from "element-plus";
export default {
  components: {
    ElInput,
    ElInputNumber,
    ElSelect,
    ElTimePicker,
    ElDatePicker,
    ElTimeSelect,
  },
};
</script>
<script setup lang="ts">
import { type PropType, ref, toRefs, computed } from "vue";
import defaultFieldsProps from "./defaultFieldsProps";
const FieldsType = {
  INPUT: "el-input",
  SELECT: "el-select",
};
type filed = {
  prop: string;
  label?: string;
  type?: string;
  options?: any[];
  [propName: string]: any;
};
interface size {
  width: number;
  quantity: number;
}
// 不同尺寸所对应的页面宽度和每行 ElFormItem 个数
const DifferentSizeData = [
  { width: 1900, quantity: 4 }, // xl
  { width: 1200, quantity: 3 }, // large
  { width: 992, quantity: 2 }, // middle
  { width: 768, quantity: 1 }, // small
  { width: 0, quantity: 1 }, // less than small
];
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  formProps: {
    type: Object,
    default: () => ({}),
  },
  fields: {
    type: Array as PropType<filed[]>,
    default: () => [],
  },
  defaultCollapse: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});
const formData: { [key: string]: any } = defineModel();
const emit = defineEmits(["search", "reset"]);
const { defaultCollapse, fields, formProps } = toRefs(props);
const isCollapse = ref(true);
isCollapse.value = defaultCollapse.value;
const searchForm = ref<any>(null);
const showCollapseBtn = computed(() => {
  const quantity = getPerLineItemQuantity();
  return fields.value.length >= quantity;
});
const getFormFieldProps = (fieldType: any, props: any) => {
  const defaultProps: { [key: string]: any } = defaultFieldsProps;
  return { ...defaultProps[fieldType], ...props };
};
const shouldCollapse = (index: any) => {
  const quantity = getPerLineItemQuantity();
  return index > quantity - 2 && isCollapse.value;
};
const getPerLineItemQuantity = () => {
  const documentScrollWidth = document.documentElement.scrollWidth;
  const size = DifferentSizeData.find(
    (item) => documentScrollWidth >= item.width
  );

  return (size as size).quantity;
};
const defaultPlaceHolder = (field: any) => {
  const newLabel = field.label.replace(":", "").replace("：", "");
  return field.type === FieldsType.SELECT
    ? `请选择${newLabel}`
    : `请输入${newLabel}`;
};
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value;
};
const handleSearch = () => {
  emit("search", formData.value);
};
const handleReset = () => {
  searchForm.value.resetFields();
  emit("reset", formData.value);
};
const handleResetForm = () => {
  searchForm.value.resetFields();
};
defineExpose({
  handleResetForm,
});
</script>
<style lang="scss" scoped>
/**  查询表单模块样式  **/
.table-search__form {
  display: flex;
  flex-wrap: wrap;
}

.table-search__row {
  width: 100%;
}

.table-search__col:last-of-type {
  margin-bottom: 0;
}

:deep(.el-form-item__label) {
  width: 128px;
  white-space: nowrap;
  overflow: hidden;
  font-weight: 400;
  font-size: 14px;
  color: #282828;
}

:deep(.el-select),
:deep(.el-cascader),
:deep(.el-date-editor--daterange.el-input),
:deep(.el-date-editor--daterange.el-input__inner),
:deep(.el-date-editor--timerange.el-input),
:deep(.el-date-editor--timerange.el-input__inner),
:deep(.el-date-editor--datetimerange.el-input),
:deep(.el-date-editor--datetimerange.el-input__inner) {
  width: 100%;
}

:deep(.el-date-editor .el-range-separator) {
  width: auto;
}

.form__item--hidden {
  display: none;
}

/**  操作按钮模块样式  **/
.table-search__btns {
  margin-left: auto;
  margin-bottom: 16px;
}

.table-search__btn--filter {
  font-size: 14px;
  color: #606266;
  cursor: pointer;
}

/**  功能样式  **/
.ml-28 {
  margin-left: 28px;
}
</style>
