<template>
  <span><span style="color:red">ERROR:</span>{{ error.message }}</span>
</template>
<script>
  export default {
    name: "feathers-error",
    props: {
      error: {
        type: [Object, Error],
        required: true
      }
    }
  };
</script>
