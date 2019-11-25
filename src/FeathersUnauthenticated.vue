<template>
  <div v-if="!feathers.authenticated">
    {{feathers.authenticated}}

    <slot></slot>
  </div>
</template>
<script>
export default {
  inject: ["feathers"],
  name: 'FeathersUnauthenticated',
  created(){
    console.log('unauthenticated loaded')
  },
  watch:{
    'feathers': function(val) {
      console.log(val)
    }
  }
};
</script>
