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
// 画布ref
const canvas = ref();
// 画布包裹器ref
const canvasWrapper = ref();
const context = ref<CanvasRenderingContext2D>();
// 绘制状态
const painting = ref<boolean>(false);
// 最新位置坐标
const lastPoint = ref<{ x: number; y: number }>({ x: 0, y: 0 });
// canvas历史记录数组和当前步骤数，每画一笔都会记录，用于撤销前进功能
const canvasHistory = ref<string[]>([]);
const step = ref(0);
// 绘制圆点
const drawCircle = (x: number, y: number, radius: number) => {
  context.value?.beginPath();
  context.value?.arc(x, y, radius, 0, Math.PI * 2);
  context.value?.fill();
  context.value?.closePath();
};
// 绘制线条
const drawLine = (x1: number, y1: number, x2: number, y2: number) => {
  context.value.beginPath();
  context.value.moveTo(x1, y1);
  context.value.lineTo(x2, y2);
  context.value.stroke();
};
// 保存历史记录方法
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
// 来自工具栏组件的配置信息
const options = ref<IAnyObject>({});
// 工具栏提供配置方法
const optionChange = (option: IAnyObject) => {
  options.value = option;
};
// 缓存画布ref
const cache = ref();
const cacheContext = ref<CanvasRenderingContext2D>();
// 绘制缓存方法
const setCache = async (imgSrc: any) => {
  cache.value.width = canvas.value.width;
  cache.value.height = canvas.value.height;
  cacheContext.value = cache.value.getContext("2d");
  cacheContext.value?.drawImage(imgSrc, 0, 0);
};
// 撤销
const undo = () => {
  if (step.value > 0) {
    step.value--;
    let canvasPic = new Image();
    canvasPic.src = canvasHistory.value[step.value];
    canvasPic.onload = () => {
      // 设置缓存
      setCache(canvasPic);
      // 清理画布
      context.value?.clearRect(0, 0, canvas.value.width, canvas.value.height);
      // 将缓存复制到画布上，通过这种方式可以解决画面闪动的问题
      context.value?.drawImage(cache.value, 0, 0);
    };
  } else {
    console.log("到头了");
  }
};
// 前进
const redo = () => {
  if (step.value < canvasHistory.value.length - 1) {
    step.value++;
    let canvasPic = new Image();
    canvasPic.src = canvasHistory.value[step.value];
    canvasPic.onload = () => {
      context.value?.clearRect(0, 0, canvas.value.width, canvas.value.height);
      context.value?.drawImage(canvasPic, 0, 0);
    };
  } else {
    console.log("已经是最新的记录了");
  }
};
// 初始化画布
const init = () => {
  canvas.value.width = canvasWrapper.value.clientWidth - 40;
  canvas.value.height = canvasWrapper.value.clientHeight - 40;
  context.value = canvas.value.getContext("2d");
  context.value.lineWidth = 2;
};
// 初始化鼠标事件，目前只支持画线
const initMouseEvent = () => {
  canvas.value.onmousedown = (e: MouseEvent) => {
    painting.value = true;
    lastPoint.value = { x: e.clientX, y: e.clientY };
  };

  canvas.value.onmousemove = (e: MouseEvent) => {
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
// 监听工具栏配置变化
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
  // 储存一张空白画布作为历史记录的第一张，否则画板无法撤回至完全空白
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
