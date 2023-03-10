<template>
  <div
    class="tools-container"
    @mouseenter="changeShowState(true)"
    @mouseleave="changeShowState(false)"
  >
    <div class="tool">
      <div class="tool-item">
        <div class="preview">
          <div
            class="point"
            :style="`width:${option.lineWidth}px;height:${option.lineWidth}px;background:${option.color}`"
          ></div>
        </div>
        <ElInputNumber
          v-model="option.lineWidth"
          size="small"
          @change="updateOption"
          style="margin-right: 8px; width: 80px"
          controls-position="right"
          :min="2"
          :max="props.currentTool.key === 'eraser' ? 40 : 20"
        />
        <ElColorPicker
          v-if="props.currentTool.key !== 'eraser'"
          v-model="option.color"
          size="small"
          color-format="hex"
          @change="updateOption"
        />
      </div>
    </div>
    <div class="tip" style="width: 42px; height: 40px">
      <component :is="props.currentTool.icon" size="16" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { IAnyObject } from "@/interface/IAnyObject";
import { ElInputNumber, ElColorPicker } from "element-plus";
import { defineEmits, ref, defineProps, PropType } from "vue";
import { ITool } from "@/interface/ITool";

const props = defineProps({
  modelValue: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  currentTool: {
    type: Object as PropType<ITool>,
    default: () => {
      return {
        icon: "icon-pencil",
        key: "pencil",
        name: "铅笔",
      };
    },
  },
});
const emit = defineEmits(["on-option-change", "update:modelValue"]);
const option = ref<IAnyObject>({
  lineWidth: 2,
  color: "#000000",
});
const showState = ref<boolean>(false);
const updateOption = () => {
  emit("on-option-change", option.value);
};
let timer = 0;
const changeShowState = (state: boolean) => {
  if (!state) {
    timer = setTimeout(() => {
      showState.value = state;
      emit("update:modelValue", showState.value);
    }, 300);
  } else {
    clearTimeout(timer);
    showState.value = state;
    emit("update:modelValue", showState.value);
  }
};
</script>

<style scoped lang="less">
.tools-container {
  width: 400px;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  border: 3px solid #3c3c3c;
  border-left: none;
  border-bottom-right-radius: 30px;
  border-top-right-radius: 30px;
  background: #f4f4f4;
  .left-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60px;
    height: 100%;
    border-right: 1px solid #444;
  }
  .tool {
    padding: 0 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: calc(100% - 40px);
    .tool-item {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .tip {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
  }
}
.preview {
  margin-right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  background: #fff;
  position: relative;
  .point {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
  }
}
</style>
