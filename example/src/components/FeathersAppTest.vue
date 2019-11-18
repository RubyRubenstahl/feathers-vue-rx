<template>
  <FeathersApp host="http://localhost:3030">
    <h1>FeathersApp Test</h1>

    <FeathersLogin />

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

      <div>
        <h2>Users</h2>
        <FeathersFind service="users">
          <template slot="loaded" slot-scope="{ data: users }">
            <ul v-for="user in users" :key="user.username">
              <li>{{ user.username }}</li>
            </ul>
          </template>
        </FeathersFind>
      </div>
    </div>
  </FeathersApp>
</template>

<script>
import "../../../src";

export default {
  name: "FeathersAppTest",
  data: function() {
    return {};
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
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
