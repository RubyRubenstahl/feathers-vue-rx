<template>
  <FeathersApp url="http://localhost:3030">
    <div id="app">
      <FeathersAppTest msg="Welcome to Your Vue.js App" />
    </div>
  </FeathersApp>
</template>

<script>
  import FeathersAppTest from "./components/FeathersAppTest.vue";
  

  export default {
    name: "app",
    components: {
      FeathersAppTest
    }
  };
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
