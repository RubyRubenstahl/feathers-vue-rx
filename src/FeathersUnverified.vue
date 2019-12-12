<template>
  <div v-if="feathers.user && feathers.user.isVerified ===false">
    <slot>{{feathers.user}}</slot>
  </div>
</template>
<script>
import feathers from '@feathersjs/feathers'
export default {
  inject: ["feathers"],
  name: 'FeathersUnverified',
};
</script>
