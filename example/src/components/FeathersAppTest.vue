<template>
  <FeathersApp :app="app">
    <section>
      <h1>FeathersApp Test</h1>
      <h2>dogs</h2>
      <FeathersFind service="dogs">
        <Loading>
          Loading...
        </Loading>
        <Loaded>
          Loaded
        </Loaded>
      </FeathersFind>
    </section>
  </FeathersApp>
</template>

<script>
  import "./FeathersApp";
  import feathers from "@feathersjs/feathers";
  import feathersMemory from "feathers-memory";

  const app = feathers();
  app.use(
    "/dogs",
    feathersMemory({
      store: {
        spot: {
          name: "Spot",
          breed: "Shih Tzu"
        },
        wendy: {
          name: "Wendy",
          breed: "lovemonster"
        },
        bear: {
          name: "Bear",
          breed: "bear"
        }
      }
    })
  );

  export default {
    name: "FeathersAppTest",
    data: function() {
      return {
        app: app
      };
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
