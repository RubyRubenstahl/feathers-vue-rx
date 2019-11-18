<template>
  <section>
    <template v-if="!initialLoadComplete && !error && pending">
      <slot name="loading" :context="context" :data="data" :service="service"
        >Default loading message</slot
      >
    </template>

    <template v-if="initialLoadComplete && !empty">
      <slot name="loaded" :context="context" :data="data" :service="service"
        >Default Loaded Slot</slot
      >
    </template>

    <template v-if="!!error">
      <slot name="error" :context="context" :data="data" :service="service">
        <span style="color: red">ERROR:</span>{{ error.message }}</slot
      >
    </template>

    <template v-if="empty">
      <slot name="empty" :context="context" :data="data" :service="service"
        >Default Empty Slot</slot
      >
    </template>

    <slot></slot>
  </section>
</template>
  <script>
  import { isNumber } from "util";

  const isPaginated = res =>
    isNumber(res.total) && isNumber(res.skip) && isNumber(res.limit);

  export default {
    name: "feathers-find",
  inject: ["feathers"],
    props: {
      query: {
        type: Object,
        default: () => ({})
      },
      params: {
        type: Object,
        default: () => ({})
      },
      hooks: {
        type: Object,
        default: () => ({})
      },
      service: {
        type: String,
        required: "true"
      },
      idField: {
        type: String,
        default: "_id"
      }
    },
    mounted() {
      this.updateContext();
    },
    methods: {
      updateContext() {
        this.context = {
          app: this.app,
          params: {
            ...this.params,
            query: { ...this.params.query, ...this.query }
          }
        };
      },
      fetchData() {
        this.updateContext();
        this.pending = true;
        const service = this.app.service(this.service);

        if (!service) {
          this.error = new Error(`Service ${this.service} not found`);
          this.pending = false;
          this.data = null;
          this.initialLoadComplete = false;
          return;
        }
        service
          .find(this.context.params)
          .then(res => {
            setTimeout(() => {
              this.history.push(["response", res, this]);
              this.intitialLoadComplete = true;
              this.paginated = isPaginated(res);
              this.data = this.paginated ? res.data : res;
              this.pending = false;
              this.initialLoadComplete = true;
            }, 2000);
          })
          .catch(err => {
            this.history.push(["error", err, this]);
            this.error = err;
            this.pending = false;
            console.error(`Error in ${this.service} find subscription`, err);
          });
      }
    },
    data() {
      return {
        context: { app: null, params: { query: {} } },
        initialLoadComplete: false,
        pending: true,
        error: null,
        history: [],
        querySubscription: null,
        timeout: false,
        data: null,
        paginated: null
      };
    },

    computed: {
      empty() {
        if (!this.initialLoadComplete) {
          return null;
        }
        return !!this.data && this.data.length === 0;
    },
    app() {
      return this.feathers.app;
      }
    },
    watch: {
      query: {
        handler: "fetchData",
        immediate: true
      }
    }
  };
</script>
