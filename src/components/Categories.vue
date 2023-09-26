<template>
  <div class="tag-cont">
    <div class="tag" @click="select">
      <span>{{ data.name }}</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  data: Object,
});

const emit = defineEmits(["select"]);

const select = () => {
  emit("select", props.data);
};
</script>

<style lang="scss" scoped>
.tag {
  padding: 2px;
  background-color: rgba(2, 102, 239, 0.2);
  /* width: 100px; */
  border-radius: 6px;
  text-align: center;
  cursor: pointer;
}
</style>
