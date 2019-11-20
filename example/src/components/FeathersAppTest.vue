<template>
  <section>
    <h1>FeathersApp Test</h1>
    <ConnectionStatus />
    <FeathersLogin />

    <div class="service-status">
      <div>
        <h2>dogs</h2>
        <div style="display:flex; flex-direction:column;align-items:flex-start">
          <FeathersEdit
            service="dogs"
            :id="editDog"
            :defaultItem="{ breed: 'shih tzu' }"
            idField="id"
          >
            <template
              slot="form"
              slot-scope="{ item, save, saving, reset, patch, isNewItem }"
            >
              <label>
                Name
                <input type="name" v-model="item.name" />
              </label>
              <label>
                Breed
                <input type="breed" v-model="item.breed" />
              </label>
              <button style="display:block;width:100%" @click="reset">
                Reset
              </button>
              <button
                style="display:block;width:100%"
                @click="save"
                :disabled="saving"
              >
                {{ isNewItem ? "Create" : "Update" }}
              </button>
            </template>
          </FeathersEdit>
        </div>
        <hr />
        <FeathersFind service="dogs">
          <template slot="loading">Custom Loading Message...</template>
          <template slot="loaded" slot-scope="{ data: dogs }">
            <ul v-for="dog in dogs" :key="dog.name">
              <li>{{ dog.name }} <a @click="editDog = dog.id">Edit</a></li>
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
            <ul v-for="user in users" :key="user._id">
              <li>{{ user.username }}</li>
            </ul>
          </template>
        </FeathersFind>
      </div>

      <div>
        <h2>Users Auth Only</h2>
        <FeathersUnauthenticated>
          This content will only display when a user is authenticated
        </FeathersUnauthenticated>
        <FeathersAuthenticated>
          <FeathersEdit service="users" :id="editUser" idField="_id">
            <template
              slot="form"
              slot-scope="{ item, save, saving, reset, patch, isNewItem }"
            >
              <label>
                Name
                <input type="name" v-model="item.username" />
              </label>
              <label>
                Breed
                <input type="breed" v-model="item.email" />
              </label>
              <button style="display:block;width:100%" @click="reset">
                Reset
              </button>
              <button
                style="display:block;width:100%"
                @click="save"
                :disabled="saving"
              >
                {{ isNewItem ? "Create" : "Update" }}
              </button>
            </template>
          </FeathersEdit>

          <FeathersFind service="users">
            <template slot="loaded" slot-scope="{ data: users }">
              <ul v-for="user in users" :key="user._id">
                <li>
                  {{ user.username }}
                  <a href="#" @click.prevent="editUser = user._id">Edit</a>
                </li>
              </ul>
            </template>
          </FeathersFind>
        </FeathersAuthenticated>
      </div>
    </div>
  </section>
</template>

<script>
import "../../../src";
import ConnectionStatus from "./ConnectionStatus";
import feathersMemory from "feathers-memory";

const dogs = {
  spot: {
    id: "1",
    name: "Spot",
    breed: "Shih Tzu"
  },
  wendy: {
    id: 2,
    name: "Wendy",
    breed: "lovemonster"
  },
  bear: {
    id: 3,
    name: "Bear",
    breed: "bear"
  }
};

export default {
  name: "FeathersAppTest",
  inject: ["feathers"],
  components: { ConnectionStatus },

  created() {
    this.feathers.app.use("/dogs", feathersMemory({ store: dogs, id: "id" }));
    this.feathers.app.use("/empty-service", feathersMemory({}));
  },
  data: function() {
    return {
      editDog: null,
      editUser: null
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.service-status {
  display: flex;
  flex-wrap: wrap;
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
