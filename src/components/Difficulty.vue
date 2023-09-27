<template>
  <span @click="select" :style="style">{{ data.name }}</span>
</template>

<script setup>
const props = defineProps({
  data: Object,
  style: String,
});

const emit = defineEmits(["select"]);

const select = () => {
  emit("select", props.data);
};
</script>
