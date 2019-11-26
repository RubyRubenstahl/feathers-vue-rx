<template>
  <div>
    <span>Connected:{{ feathers.connected }}</span
    ><br />
    <span>Online:{{ feathers.online }}</span>
  </div>
</template>
<script>
export default {
  name:'ConnectionStatus',
   inject: ["feathers"],
  data(){return {

  }},
};
</script>
