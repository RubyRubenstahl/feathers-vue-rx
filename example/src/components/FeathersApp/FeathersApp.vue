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
      app: feathers()
    };
  },
  computed: {
    feathers() {
      return {
        app: this.app
      };
    }
  },
  provide() {
    return {
      feathers: this.feathers
    };
  },
  methods: {}
};
</script>
