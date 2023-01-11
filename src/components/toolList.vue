<template>
  <div>
    <input
      type="number"
      v-model="option.lineWidth"
      @change="updateOption"
      min="2"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, defineEmits } from "vue";
import { IAnyObject } from "@/interface/IAnyObject";

const emit = defineEmits(["on-option-change"]);
const option = ref<IAnyObject>({});
const updateOption = () => {
  emit("on-option-change", option.value);
};
</script>

<style scoped lang="less"></style>
