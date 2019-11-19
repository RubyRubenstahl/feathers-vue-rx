<template>
  <span>Connected:{{ feathers.connected }}</span>
</template>
<script>
export default {
  inject: ["feathers"]
};
</script>
