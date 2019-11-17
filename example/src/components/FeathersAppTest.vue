<template>
  <FeathersApp :app="app">
    <h1>FeathersApp Test</h1>

    <div class="service-status">
      <div>
        <h2>dogs</h2>
        <FeathersFind service="dogs">
          <template slot="loading">Custom Loading Message...</template>
          <template slot="loaded" slot-scope="{ data: dogs }">
            <ul v-for="dog in dogs" :key="dog.name">
              <li>{{ dog.name }}</li>
            </ul>
          </template>
        </FeathersFind>
      </div>

      <div>
        <h2>empty-service</h2>
        <FeathersFind service="empty-service"> </FeathersFind>
      </div>

      <div>
        <h2>missing-service</h2>
        <FeathersFind service="missing-service"> </FeathersFind>
      </div>
    </div>
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

  app.use("/empty-service", feathersMemory({}));

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
<style >
.service-status {
  display: flex;

  color: #444;
}

.service-status > div {
  border: 1px solid #eee;
  margin: 16px;
  flex-basis: 300px;
  box-shadow: 5px 5px 5px #00000044;
  border-radius: 8px;
  padding: 0;
  padding-bottom: 16px;
}

.service-status h2 {
  color: #3f3f3f;
  margin: 0;
  background-color: #d1d1d1;
  border-radius: 8px;
  padding: 8px;
  padding-bottom: 5px;
  margin-bottom: 8px;
  text-shadow: 2px 2px 3px #44444450;
}
</style>
