<template>
  <div>
    <slot></slot>
  </div>
</template>
<script>
  export default {
    name: "feathers-app",
    props: {
      app: {
        type: Object,
        required: true
      }
    },

    mounted() {},
    data() {
      return {};
    },
    provide() {
      return { app: this.app };
    },
    methods: {},
    computed: {}
  };
</script>