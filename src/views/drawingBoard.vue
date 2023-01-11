<template>
  <div class="container">
    <div class="aside">
      <ToolList @on-option-change="optionChange"></ToolList>
    </div>
    <div class="main">
      <div class="canvasWrapper" ref="canvasWrapper">
        <canvas ref="canvas" style="background: #fafafa"></canvas>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import ToolList from "@/components/toolList.vue";
import { ref, onMounted } from "vue";
import { IAnyObject } from "@/interface/IAnyObject";

const canvas = ref();
const canvasWrapper = ref();
const drawOption = ref<IAnyObject>({});
const context = ref<CanvasRenderingContext2D>({});
const lastPoint = ref<{ x: number; y: number }>({ x: 0, y: 0 });
const painting = ref<boolean>(false);

const drawCircle = (x: number, y: number, radius: number) => {
  context.value.beginPath();
  context.value.arc(x, y, radius, 0, Math.PI * 2);
  context.value.fill();
  context.value.closePath();
};

const drawLine = (x1: number, y1: number, x2: number, y2: number) => {
  context.value.beginPath();
  context.value.moveTo(x1, y1);
  context.value.lineTo(x2, y2);
  context.value.stroke();
};

const optionChange = (option: IAnyObject) => {
  for (let key in option) {
    context.value[key] = option[key];
  }
};
const init = () => {
  canvas.value.width = canvasWrapper.value.clientWidth - 40;
  canvas.value.height = canvasWrapper.value.clientHeight - 40;
  context.value = canvas.value.getContext("2d");
  context.value.lineWidth = 2;
  canvas.value.onmousedown = (e) => {
    painting.value = true;
    lastPoint.value = { x: e.clientX, y: e.clientY };
  };

  canvas.value.onmousemove = (e) => {
    if (painting.value === true) {
      drawCircle(
        lastPoint.value.x - 220,
        lastPoint.value.y - 20,
        context.value.lineWidth / 2
      );
      drawLine(
        lastPoint.value.x - 220,
        lastPoint.value.y - 20,
        e.clientX - 220,
        e.clientY - 20
      );
      lastPoint.value = { x: e.clientX, y: e.clientY };
    }
  };

  canvas.value.onmouseup = () => {
    painting.value = false;
  };
};
onMounted(() => {
  init();
  console.log(context.value);
});
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  .aside {
    width: 200px;
    height: 100%;
    border: 1px solid red;
  }
  .main {
    height: 100%;
    width: calc(100% - 200px);
    .canvasWrapper {
      width: 100%;
      height: 100%;
      padding: 20px;
    }
  }
}
</style>
