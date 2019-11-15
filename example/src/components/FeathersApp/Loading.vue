<template>
  <div v-if="!initialLoadComplete && pending">
    <slot
      :service="service"
      :pending="pending"
      :initialLoadComplete="initialLoadComplete"
      :error="error"
    ></slot>
  </div>
</template>
<script>
  export default {
    name: "feathers-data-loading",
    computed: {
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