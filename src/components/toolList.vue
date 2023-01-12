<template>
  <div>还没有样式的工具栏</div>
  <div>
    <ElButton size="small" @click="undo">撤销</ElButton>
    <ElButton size="small" @click="redo">前进</ElButton>

    <ElForm>
      <ElFormItem label="笔刷大小">
        <ElInputNumber
          type="number"
          v-model="option.lineWidth"
          size="small"
          @change="updateOption"
          :min="2"
          :max="20"
          controls-position="right"
      /></ElFormItem>
      <ElFormItem label="笔刷颜色">
        <ElColorPicker
          v-model="option.color"
          color-format="hex"
          @change="updateOption"
        ></ElColorPicker>
      </ElFormItem>
    </ElForm>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineEmits } from "vue";
import { IAnyObject } from "@/interface/IAnyObject";
import {
  ElInputNumber,
  ElForm,
  ElFormItem,
  ElColorPicker,
  ElButton,
} from "element-plus";

const emit = defineEmits(["on-option-change", "undo", "redo"]);
const option = ref<IAnyObject>({
  lineWidth: 2,
  color: "#000000",
});
const updateOption = () => {
  emit("on-option-change", option.value);
};
const undo = () => {
  emit("undo");
};
const redo = () => {
  emit("redo");
};
</script>

<style scoped lang="less"></style>
