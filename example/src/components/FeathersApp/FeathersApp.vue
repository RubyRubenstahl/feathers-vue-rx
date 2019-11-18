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

  },
    data() {
    return {
      app: feathers()
    };
  },
  computed: {
    feathers() {
      return {
        app: this.app
      };
    }
    },
    provide() {
    return {
      feathers: this.feathers
    };
    },
  methods: {}
  };
</script>
