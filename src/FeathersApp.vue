<template>
  <div>
    <slot :feathers="feathers"></slot>
  </div>
</template>
<script>
  import Vue from "vue";
  import feathers from "@feathersjs/feathers";
  import socketio from "@feathersjs/socketio-client";
  import io from "socket.io-client";
  import auth from "@feathersjs/authentication-client";
  import FeathersEmpty from "./FeathersEmpty";
  import FeathersError from "./FeathersError";
  import FeathersPending from "./FeathersPending";
  import reactive from "feathers-reactive";
  console.log('Registering feathersApp')
  export default {
    name: "FeathersApp",
    props: {
      url: {
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
   provide(){
     return {feathers: this.feathers}
   },
    created() {
      if (this.url) {
        const socket = io(this.url);
        this.feathers.app.configure(socketio(socket));
        this.registerSocketEventHandlers(socket);
      }

      this.feathers.app.configure(reactive({ idField: this.defaultIdField }));
      this.feathers.app.configure(auth({}));

      window.addEventListener("offline", () => (this.feathers.online = false));
      window.addEventListener("online", () => (this.feathers.online = true));
    },
    mounted() {
      Vue.prototype.$feathers = this.feathers;
    },
    data() {
      return {
        feathers:{
          app: this.app || feathers(),
          authenticating: false,
          authenticated: false,
          user: null,
          connected: false,
          online: navigator ? navigator.onLine : true,
          authenticationError: null,
          login: this.login,
          logout: this.logout,
          defaultEmptyComponent: this.defaultEmptyComponent,
          defaultErrorComponent: this.defaultErrorComponent,
          defaultPendingComponent: this.defaultPendingComponent,
        }
      };
    },
    methods: {
      async login(credentials, strategy = "local") {
        console.log("Logging in");
        this.feathers.authenticating = true;
        this.feathers.authenticated = false;
        return this.feathers.app
          .authenticate({ strategy, ...credentials })
          .then(res => {
            console.log("Login successful");
            this.feathers.user = res.user;
            this.feathers.authenticating = false;
            if(res.user){
              this.feathers.authenticated = true;
              localStorage.setItem("username", credentials.username);
              this.$emit('login', res.user);
            }
            //  this.$emit('login', this.user);
            return res.user;
          })
          .catch(err => {
            console.error(`Login failed: ${err.message}`);
            this.feathers.authenticating = false;
            this.feathers.authenticated = false;
            this.feathers.authenticationError = err;
          });
      },
      reAuthenticate() {
        console.log("Attempting to re-authenticate");
        this.feathers.authenticating = true;
        this.feathers.authenticated = false;
        return this.feathers.app
          .reAuthenticate()
          .then(res => {
            console.log("Login successful");
            this.feathers.user = res.user;
            this.feathers.authenticating = false;
            if(res.user){
              this.feathers.authenticated=true;
              this.$emit('login', res.user);
            }
            return res.user;
          })
          .catch(err => {
            this.feathers.authenticating = false;
            this.feathers.authenticated = false;
            throw err;
          });
      },
      async logout() {
        this.feathers.app.logout();
        this.feathers.authenticated = false;
        this.feathers.authenticating = false;
        this.$emit('logout');
      },
      registerSocketEventHandlers(socket) {
        socket.on("connect", () => {
          console.log('connected')
          this.feathers.connected = true;
          this.reAuthenticate();
        });
        socket.on("disconnect", () => {
          this.feathers.connected = false;
          console.warn('Disconnected')
        });
        socket.on("error", err => {
            this.feathers.connected = false;
            console.error('Socket error', err)

        });
      }
    }
  };
</script>
