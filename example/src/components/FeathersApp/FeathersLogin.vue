<template>
  <section>
    <slot>
      <Form name="login">
        <label>
          Username
          <input type="text" v-model="credentials.username" />
        </label>

        <label>
          Password
          <input type="password" v-model="credentials.password" />
        </label>
        <button type="submit" @click.prevent="login(credentials)">
          Log In
        </button>
      </Form>
    </slot>
    <template v-if="error">
      <slot name="error" :error="error">ERROR: {{ error.message }}</slot>
    </template>
  </section>
</template>
<script>
export default {
  name: "feathers-login",
  inject: ["feathers"],
  props: {
    strategy: {
      type: String,
      default: "local"
    }
  },
  mounted() {},
  methods: {
    login(credentials) {
      this.error = null;
      const authDetails = { strategy: this.strategy, ...credentials };
      this.feathers
        .login(authDetails)
        .then(user => {
          console.log(user);
        })
        .catch(err => {
          console.log("Oho!");
          this.error = err;
        });
    }
  },
  data() {
    return {
      error: null,
      credentials: {
        username: null,
        password: null
      }
    };
  },

  computed: {
    app() {
      return this.feathers.app;
    }
  },
  watch: {}
};
</script>
