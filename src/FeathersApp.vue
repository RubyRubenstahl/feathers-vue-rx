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
import { ReactiveProvideMixin } from "vue-reactive-provide";
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
import Vue from "vue";
export default {
  name: "feathers-app",
  props: {
    host: {
      type: String
    }
  },
  mixins: [
    ReactiveProvideMixin({
      name: "feathers",
      include: [
        "app",
        "authenticating",
        "authenticated",
        "user",
        "connected",
        "login",
        "logout"
      ]
    })
  ],
  created() {
    if (this.host) {
      const socket = io(this.host);
      this.app.configure(socketio(socket));
      socket.on("connect", () => {
        this.reAuthenticate();
      });
    }

    this.app.configure(auth({}));

    this.app.use("/dogs", feathersMemory({ store: dogs }));
    this.app.use("/empty-service", feathersMemory({}));
  },
  data() {
    return {
      app: feathers(),
      authenticating: false,
      authenticated: false,
      user: null,
      connected: false
    };
  },
  methods: {
    async login(credentials, strategy = "local") {
      console.log("Logging in");
      this.authenticating = true;
      this.authenticated = false;
      return this.app
        .authenticate({ strategy, ...credentials })
        .then(res => {
          console.log("Login successful");
          this.user = res.user;
          this.authenticating = false;
          this.$set(this, "authenticated", true);
          localStorage.setItem("username", credentials.username);
          return res.user;
        })
        .catch(err => {
          console.error(`Login failed: ${err.message}`);
          this.authenticating = false;
          this.authenticated = false;

          throw err;
        });
    },
    reAuthenticate() {
      console.log("Attempting to re-authenticate");
      this.authenticating = true;
      this.authenticated = false;
      return this.app
        .reAuthenticate()
        .then(res => {
          console.log("Login successful");
          this.user = res.user;
          this.authenticating = false;
          this.$set(this, "authenticated", true);
          return res.user;
        })
        .catch(err => {
          this.authenticating = false;
          this.authenticated = false;
          throw err;
        });
    },
    async logout() {
      this.app.logout();
      this.authenticated = false;
      this.authenticating = false;
    }
  }
};
</script>
