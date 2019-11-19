<template>
  <section>
    <template v-if="!initialLoadComplete && !error && pending">
      <slot name="loading" :context="context" :data="data" :service="service">
        <component :is="feathers.defaultPendingComponent" />
      </slot>
    </template>

    <template v-if="initialLoadComplete && !empty">
      <slot name="loaded" :context="context" :data="data" :service="service">
        {{ data }}
      </slot>
    </template>

    <template v-if="!!error">
      <slot name="error" :context="context" :data="data" :service="service">
        <component :is="feathers.defaultErrorComponent" :error="error" />
      </slot>
    </template>

    <template v-if="empty">
      <slot name="empty" :context="context" :data="data" :service="service"
        ><component :is="feathers.defaultEmptyComponent"
      /></slot>
    </template>
    <slot></slot>
  </section>
</template>
<script>
import { isNumber } from "util";
import isEqual from "lodash.isequal";
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
        this.initialLoadComplete = false;
        return;
      }
      this.querySubscription = service
        .watch(this.ervice)
        .find(this.context.params)
        .subscribe(
          res => {
            setTimeout(() => {
              this.history.push(["response", res, this]);
              this.intitialLoadComplete = true;
              this.paginated = isPaginated(res);
              this.data = this.paginated ? res.data : res;
              this.pending = false;
              this.initialLoadComplete = true;
            }, 2000);
          },
          err => {
            this.history.push(["error", err, this]);
            this.$set(this, "error", err);
            this.pending = false;
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
      handler: "runQuery",
      immediate: true
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
    }
  },
  query(newQuery, prevQuery) {
    if (!isEqual(newQuery, prevQuery)) {
      this.updating = true;
      this.querySubscription.unsubscribe();
      this.runQuery();
    }
  }
};
</script>
