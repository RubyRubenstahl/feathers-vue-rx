<template>
  <div>
    <span>Connected:{{ feathers.connected }}</span
    ><br />
    <span>Online:{{ feathers.online }}</span>
  </div>
</template>
<script>
export default {
  inject: ["feathers"]
};
</script>
