<template>
  <div class="container">
    <div class="aside">
      <ToolList
        @on-option-change="optionChange"
        @redo="redo"
        @undo="undo"
      ></ToolList>
    </div>
    <div class="main">
      <div class="canvasWrapper" ref="canvasWrapper">
        <canvas ref="canvas" style="background: #fafafa"></canvas>
        <canvas ref="cache" style="display: none"></canvas>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import ToolList from "@/components/toolList.vue";
import { ref, onMounted, computed, watch } from "vue";
import { IAnyObject } from "@/interface/IAnyObject";

const canvas = ref();
const canvasWrapper = ref();
const context = ref<CanvasRenderingContext2D>({});
const lastPoint = ref<{ x: number; y: number }>({ x: 0, y: 0 });
const painting = ref<boolean>(false);
const canvasHistory = ref<string[]>([]);
const step = ref(0);
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
const saveHistory = () => {
  step.value++;
  if (step.value < canvasHistory.value.length) {
    canvasHistory.value.length = step.value; // 截断数组
  }
  canvasHistory.value.push(canvas.value.toDataURL());
};
const computedOptions = computed(() => {
  return {
    lineWidth: options.value.lineWidth,
    fillStyle: options.value.color,
    strokeStyle: options.value.color,
  };
});
const options = ref<IAnyObject>({});
const optionChange = (option: IAnyObject) => {
  options.value = option;
};
const cache = ref();
const cacheContext = ref<CanvasRenderingContext2D>({});
const setCache = async (imgSrc: any) => {
  cache.value.width = canvas.value.width;
  cache.value.height = canvas.value.height;
  cacheContext.value = cache.value.getContext("2d");
  cacheContext.value.drawImage(imgSrc, 0, 0);
};
const undo = () => {
  if (step.value > 0) {
    step.value--;
    let canvasPic = new Image();
    canvasPic.src = canvasHistory.value[step.value];
    canvasPic.onload = () => {
      setCache(canvasPic);
      context.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
      context.value.drawImage(cache.value, 0, 0);
    };
  } else {
    console.log("到头了");
  }
};

const redo = () => {
  if (step.value < canvasHistory.value.length - 1) {
    step.value++;
    let canvasPic = new Image();
    canvasPic.src = canvasHistory.value[step.value];
    canvasPic.onload = () => {
      context.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
      context.value.drawImage(canvasPic, 0, 0);
    };
  } else {
    console.log("已经是最新的记录了");
  }
};

const init = () => {
  canvas.value.width = canvasWrapper.value.clientWidth - 40;
  canvas.value.height = canvasWrapper.value.clientHeight - 40;
  context.value = canvas.value.getContext("2d");
  context.value.lineWidth = 2;
  context.value.shadowBlur = 1;
};
const initMouseEvent = () => {
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
    saveHistory();
    painting.value = false;
  };
};

watch(
  () => {
    return computedOptions.value;
  },
  () => {
    for (let key in computedOptions.value) {
      context.value[key] = computedOptions.value[key];
    }
  }
);
onMounted(() => {
  init();
  initMouseEvent();
  canvasHistory.value.push(canvas.value.toDataURL());
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
    border-right: 2px solid #aaaaaaaa;
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
