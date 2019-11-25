<template>
  <section v-if="!invisible">
    <template v-if="!initialLoadComplete && !error && pending">
      <slot name="loading" :data="data" :service="service">
        <component :is="feathers.defaultPendingComponent" />
      </slot>
    </template>

    <template v-if="initialLoadComplete && !empty">
      <slot name="loaded" :data="data" :service="service">
        {{ data }}
      </slot>
    </template>

    <template v-if="!!error">
      <slot name="error" :data="data" :service="service">
        <component :is="feathers.defaultErrorComponent" :error="error" />
      </slot>
    </template>

    <template v-if="empty">
      <slot name="empty" :data="data" :service="service"
        ><component :is="feathers.defaultEmptyComponent"
      /></slot>
    </template>
    <slot></slot>
  </section>
</template>
<script>
import { isNumber } from "util";
import isEqual from "lodash.isequal";
import uniqBy from "lodash.uniqby";
import naturalCompare from "string-natural-compare";

const isPaginated = res =>
  isNumber(res.total) && isNumber(res.skip) && isNumber(res.limit);

export default {
  name: "FeathersFind",
  inject: ["feathers"],
  props: {
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
      // Name of the service to find from 
      type: String,
      required: "true"
    },
    idField: {
      // Id field for the service
      type: String,
      default: "_id"
    },
    sortBy: {
      // Field name to sort on after find is complete
      type: String,
      default: null
    },
    invisible:{
      // Hides default slots
      type: Boolean,
      default: false
    }
  },
  mounted() {},
  componentWillUnmount() {
    this.querySubscription.unsubscribe();
  },
  methods: {
    runQuery() {
      this.pending = true;
      const service = this.app.service(this.service);
      if (!service) {
        this.error = new Error(`Service ${this.service} not found`);
        this.pending = false;
        this.data = null;
        this.initialLoadComplete = false;
        return;
      }

      const params = {
        ...this.params,
        query: { ...this.params.query, ...this.query }
      };

      this.querySubscription = service
        .watch(this.ervice)
        .find(params)
        .subscribe(
          res => {
            setTimeout(() => {
              this.history.push(["response", res, this]);
              this.intitialLoadComplete = true;
              this.paginated = isPaginated(res);
              this.data = this.paginated ? res.data : res;

              // Prevent duplicates that can appear in some situations
              if (Array.isArray(this.data)) {
                this.data = uniqBy(this.data, this.idField);
              }
              if (this.sortBy && Array.isArray(this.data)) {
                this.data.sort((a, b) =>
                  naturalCompare(a[this.sortBy], b[this.sortBy], {
                    caseInsensitive: true
                  })
                );
              }
              this.$emit("loaded", res);
              this.pending = false;
              this.initialLoadComplete = true;
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
      handler: function query(newQuery, prevQuery) {
        if (!isEqual(newQuery, prevQuery)) {
          this.updating = true;
          if (this.querySubscription) {
            this.querySubscription.unsubscribe();
          }
          this.runQuery();
        }
      },
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
  }
};
</script>
