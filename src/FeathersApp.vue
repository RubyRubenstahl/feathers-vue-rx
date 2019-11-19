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
import FeathersEmpty from "./FeathersEmpty";
import FeathersError from "./FeathersError";
import FeathersPending from "./FeathersPending";
import reactive from "feathers-reactive";

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
    },
    defaultIdField: {
      type: String,
      default: "_id"
    },
    defaultEmptyComponent: {
      type: Object,
      default: () => FeathersEmpty
    },
    defaultErrorComponent: {
      type: Object,
      default: () => FeathersError
    },
    defaultPendingComponent: {
      type: Object,
      default: () => FeathersPending
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
        "logout",
        "defaultEmptyComponent",
        "defaultErrorComponent",
        "defaultPendingComponent"
      ]
    })
  ],
  created() {
    if (this.host) {
      const socket = io(this.host);
      this.app.configure(socketio(socket));
      this.registerSocketEventHandlers(socket);
    }

    this.app.configure(reactive({ idField: this.defaultIdField }));
    this.app.configure(auth({}));

    this.app.use("/dogs", feathersMemory({ store: dogs }));
    this.app.use("/empty-service", feathersMemory({}));
  },
  mounted() {
    Vue.prototype.$feathers = this.feathers;
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
    },
    registerSocketEventHandlers(socket) {
      socket.on("connect", () => {
        this.connected = true;
        this.reAuthenticate();
      });
      socket.on("disconnect", () => {
        this.connected = false;
      });
      socket.on("error", () => {
        this.connected = false;
      });
    }
  }
};
</script>
