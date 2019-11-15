<template>
  <div v-if="initialLoadComplete">
    <slot
      :data="data"
      :service="service"
      :pending="pending"
      :initialLoadComplete="initialLoadComplete"
      :error="error"
    ></slot>
  </div>
</template>
<script>
  export default {
    name: "feathers-data-loaded",
    computed: {
      data() {
        return this.$parent.data;
      },
      service() {
        return this.$parent.service;
      },
      pending() {
        return this.$parent.pending;
      },
      initialLoadComplete() {
        return this.$parent.initialLoadComplete;
      },
      error() {
        return this.$parent.error;
      }
    }
  };
</script>