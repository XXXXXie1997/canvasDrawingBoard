<template>
  <div
    class="tools-container"
    @mouseenter="changeShowState(true)"
    @mouseleave="changeShowState(false)"
  >
    <div class="tool">
      <div class="tool-item">
        <ElIcon :size="16">
          <EditPen />
        </ElIcon>
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
          :max="20"
        />
        <ElColorPicker
          v-model="option.color"
          size="small"
          color-format="hex"
          @change="updateOption"
        />
      </div>
    </div>
    <div class="tip" style="width: 42px; height: 40px">
      <ElIcon :size="22">
        <Operation />
      </ElIcon>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineEmits } from "vue";
import { IAnyObject } from "@/interface/IAnyObject";
import { EditPen, Operation } from "@element-plus/icons-vue";
import {
  ElInputNumber,
  ElColorPicker,
  ElSelect,
  ElOption,
  ElIcon,
} from "element-plus";

const emit = defineEmits(["on-option-change", "change-show-state"]);
const option = ref<IAnyObject>({
  lineWidth: 2,
  color: "#000000",
});
const showState = ref<boolean>(false);
const updateOption = () => {
  emit("on-option-change", option.value);
};
const changeShowState = (state: boolean) => {
  showState.value = state;
  emit("change-show-state", showState.value);
};
</script>

<style scoped lang="less"></style>
<style lang="less">
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
