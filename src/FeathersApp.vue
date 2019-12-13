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
          verifyUser: this.verifyUser,
          defaultEmptyComponent: this.defaultEmptyComponent,
          defaultErrorComponent: this.defaultErrorComponent,
          defaultPendingComponent: this.defaultPendingComponent,
          verificationError: null,
          verifying:false,
          resendVerification: this.resendVerification,
          badToken: false,
          sendPasswordResetCode: this.sendPasswordResetCode,
          resetPassword: this.resetPassword

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
      async verifyUser(token){
        this.feathers.verifying=true;
        const data = {
          action: 'verifySignupShort',
          value:{
          user: {username: this.feathers.user.username},
          token
          }
        }
        this.feathers.app.service('authManagement').create(data)
        .then(user=>{
          this.feathers.verifying=false;
          this.$set(this.feathers,'user', user);
          this.$set(this.feathers,'verificationError', null);
          this.feathers.authenticated = true;
          this.feathers.verificationError=null;
          this.feathers.badToken = false;
        })
        .catch(err=>{
          this.feathers.verifying = false;
          this.feathers.verificationError=err;
          const errorClass = err.errors && err.errors.$className
          this.feathers.badToken = errorClass === 'verifyExpired' || errorClass==='badParam'
          console.log(`User verification failed.`, err)
        })
      },
      async resendVerification(){
        this.feathers.badToken=false;
        this.feathers.verificationError=false;
        this.feathers.app.service('authManagement').create({ 
          action: 'resendVerifySignup',
          value:{username: this.feathers.user.username},
          notifierOptions: {}, // options passed to options.notifier, e.g. {preferredComm: 'cellphone'}
        }).catch(err=>{
           this.$set(this.feathers,'verificationError', err);
        }).then(res=>{
          console.log('New token created')
        })
      },
      async sendPasswordResetCode(email){
              // send forgotten password notification
           await this.feathers.app.service('authManagement').create({ 
              action: 'sendResetPwd',
              value: {email}, // {email}, {token: verifyToken}
            }).catch(err=>console.error(`Error sending reset code`, err))
      },
      async resetPassword({user, token, password}){
              // send forgotten password notification
           await this.feathers.app.service('authManagement').create({ 
              action: 'resetPwdShort',
              value: {user, token, password}, // {email}, {token: verifyToken}
            }).catch(err=>console.error(`Error resetting password`, err))
            .then(res=>console.log(res))
      },
      async logout() {
        this.feathers.app.logout();
        this.feathers.user = null;
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
