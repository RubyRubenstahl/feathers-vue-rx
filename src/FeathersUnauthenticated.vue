<template>
  <div v-if="!feathers.authenticated">
    <slot></slot>
  </div>
</template>
<script>
export default {
  inject: ["feathers"]
};
</script>
