<template>
  <div>
    <slot></slot>
  </div>
</template>
<script>
import feathers from "@feathersjs/feathers";
import feathersMemory from "feathers-memory";
import socketio from "@feathersjs/socketio-client";
import io from "socket.io-client";
import auth from "@feathersjs/authentication-client";

const dogs = {
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
};

export default {
  name: "feathers-app",
  props: {
    host: {
      type: String
    }
  },

  created() {
    if (this.host) {
      const socket = io(this.host);
      this.app.configure(socketio(socket));
    }

    this.app.configure(auth({}));

    this.app.use("/dogs", feathersMemory({ store: dogs }));
    this.app.use("/empty-service", feathersMemory({}));
  },
  data() {
    return {
      app: feathers(),
      authenticating: false,
      user: null,
      connected: false
    };
  },
  computed: {
    feathers() {
      return {
        app: this.app,
        authenticating: this.authenticating,
        user: this.user,
        connected: this.connected,
        login: this.login
      };
    }
  },
  provide() {
    return {
      feathers: this.feathers
    };
  },
  methods: {
    async login(credentials) {
      console.log("Logging in");

      this.authenticating = true;
      return this.app
        .authenticate({ strategy: this.strategy, ...credentials })
        .then(user => {
          console.log("Login successful");
          this.user = user;
          this.authenticating = false;
          return user;
        })
        .catch(err => {
          console.error(`Login failed: ${err.message}`);
          this.authenticating = false;
          throw err;
        });
    }
  }
};
</script>
