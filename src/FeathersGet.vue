<template>
  <section v-if="!invisible">
    <template v-if="!error && pending">
      <DelayRender>
        <slot name="loading" :context="context" :data="data" :service="service">
          <component :is="feathers.defaultPendingComponent" />
        </slot>
      </DelayRender>
    </template>

    <template v-if="!error && !empty">
      <slot name="loaded" :context="context" :data="data" :service="service">
        <VueJsonPretty :data="data">  </VueJsonPretty>
      </slot>
    </template>

    <template v-if="!!error">
      <slot name="error" :context="context" :data="data" :service="service">
        <component :is="feathers.defaultErrorComponent" :error="error" />
      </slot>
    </template>

    <slot></slot>
  </section>
</template>
<script>
import { isNumber } from "util";
import isEqual from "lodash.isequal";
import VueJsonPretty from 'vue-json-pretty';

  export default {
    name: "FeathersGet",
    inject: ["feathers"],
    components: {VueJsonPretty},
    props: {
      id: {
        // ID of the item to get
        type: String,
        required: true
      },
      query: {
        // Feathers style query
        type: Object,
        default: () => ({})
      },
      params: {
        // Params to pass. The query will be merged in
        type: Object,
        default: () => ({})
      },
      hooks: {
        // Standard feathers hook object to be run
        type: Object,
        default: () => ({})
      },
      service: {
        // Name of the service to get from 
        type: String,
        required: "true"
      },
      idField: {
        // ID Field for the service
        type: String,
        default: "_id"
      },
   
    invisible: {
      // Hides default slots
      type: Boolean,
      default: false
    },
        pendingComponent:{
      default:null
    }
  },
  mounted() {
    this.updateContext();
  },
  componentWillUnmount() {
    this.querySubscription.unsubscribe();
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
    runQuery() {
      this.updateContext();
      this.pending = true;
      const service = this.app.service(this.service);
      if (!service) {
        this.error = new Error(`Service ${this.service} not found`);
        this.pending = false;
        this.data = null;
        return;
      }
      this.querySubscription = service
        .watch(this.service)
        .get(this.id, this.context.params)
        .subscribe(
          res => {
            setTimeout(() => {
              this.history.push(["response", res, this]);
              this.data = res;
              this.pending = false;
              this.$emit("loaded", res);
            }, 0);
          },
          err => {
            this.history.push(["error", err, this]);
            this.$set(this, "error", err);
            this.pending = false;
            this.$emit('error', err)
            console.error(`Error in ${this.service} find subscription`, err);
          }
        );
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
      data: null
    };
  },

  computed: {
    empty() {
      return !this.data;
    },
    app() {
      return this.feathers.app;
    }
  },
  watch: {
      query:{
        deep:true,
        immediate: true,
        handler: function query(newQuery, prevQuery) {
          if (!isEqual(newQuery, prevQuery)) {
          if (this.querySubscription) {
            this.querySubscription.unsubscribe();
          }
          this.runQuery();
        }
      },
    },
    "feathers.authenticated"(isAuthenticated) {
      if (
        isAuthenticated &&
        this.error &&
        this.error.className === "not-authenticated"
      ) {
        this.error = null;
        this.runQuery();
      }
    },
    id: {
      immediate: true,
      handler: function(newId, oldId) {
        if (!isEqual(newId, oldId)) {
          this.updating = true;
          if (this.querySubscription) {
            this.querySubscription.unsubscribe();
          }
          this.runQuery();
        }
      }
    }
  }
};
</script>
