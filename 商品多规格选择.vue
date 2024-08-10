<template>
  <div>
    <div v-for="spec in productSpecs" :key="spec.name">
      <h3>{{ spec.name }}</h3>
      <div v-for="option in spec.options" :key="option">
        <button
          :disabled="!isOptionAvailable(spec.name, option)"
          :class="{ disabled: !isOptionAvailable(spec.name, option) }"
          @click="selectOption(spec.name, option)"
        >
          {{ option }}
        </button>
      </div>
    </div>

    <div>
      <h3>当前选择:</h3>
      <div v-for="(option, spec) in selectedOptions" :key="spec">
        {{ spec }}: {{ option }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      productSpecs: [
        {
          name: "颜色",
          options: ["红色", "蓝色", "绿色"],
        },
        {
          name: "尺寸",
          options: ["小", "中", "大"],
        },
      ],
      selectedOptions: {},
      availableOptions: {
        红色: ["小", "中"],
        蓝色: ["中", "大"],
        绿色: ["小", "大"],
      },
    };
  },
  methods: {
    selectOption(specName, option) {
      this.$set(this.selectedOptions, specName, option);
    },
    isOptionAvailable(specName, option) {
      if (specName === "颜色") {
        return true;
      }
      const selectedColor = this.selectedOptions["颜色"];
      if (!selectedColor) {
        return true;
      }
      return this.availableOptions[selectedColor].includes(option);
    },
  },
};
</script>

<style>
.disabled {
  background-color: #f0f0f0;
  color: #ccc;
}
</style>

落地成果 https://www.zhihaoscm.com/ 官网上线后
用户在电脑首次无缓存情况下打开页面实现“秒开”
