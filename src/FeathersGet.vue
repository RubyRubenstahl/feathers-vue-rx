<template>
  <section v-if="!invisible">
    <template v-if="!error && pending">
      <slot name="loading" :context="context" :data="data" :service="service">
        <component :is="feathers.defaultPendingComponent" />
      </slot>
    </template>

    <template v-if="!error && !empty">
      <slot name="loaded" :context="context" :data="data" :service="service">
        {{ data }}
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

    idField: {
      type: String,
      default: "_id"
    },
    invisible: {
      // Hides default slots
      type: Boolean,
      default: false
    }
  },
  mounted() {
              }, 0);
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
