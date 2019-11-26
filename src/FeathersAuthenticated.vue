<template>
  <div v-if="feathers.authenticated">
    <slot></slot>
  </div>
</template>
<script>
export default {
  inject: ["feathers"],
  name: 'FeathersAuthenticated',
  created(){
    console.log('authenticated loaded')
  }
};
</script>
