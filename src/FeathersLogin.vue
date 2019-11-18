<template>
  <section>
    <slot>
      <div v-if="!feathers.authenticated">
        <Form name="form">
          <label>
            Username
            <input type="text" v-model="credentials.username" />
          </label>

          <label>
            Password
            <input type="password" v-model="credentials.password" />
          </label>
          <button type="submit" @click.prevent="feathers.login(credentials)">
            Log In
          </button>
        </Form>
      </div>
      <div v-if="feathers.authenticated">
        {{ feathers.user.username }}
        <button type="submit" @click.prevent="feathers.logout()">
          Log Out
        </button>
      </div>
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
  mounted() {
    const username = localStorage.getItem("username");
    this.credentials.username = username;
  },
  methods: {},
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
