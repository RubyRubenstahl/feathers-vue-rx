<template>
  <section>
    <slot></slot>
  </section>
</template>
  <script>
  import { isNumber } from "util";
  const isPaginated = res =>
    isNumber(res.total) && isNumber(res.skip) && isNumber(res.limit);

  export default {
    name: "feathers-find",
    inject: ["app"],
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
      this.fetchData();
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
        this.pending = true;

        this.app
          .service(this.service)
          .find(this.context.params)
          .then(res => {
            setTimeout(() => {
              this.history.push(["response", res, this]);
              this.intitialLoadComplete = true;
              this.paginated = isPaginated(res);
              this.data = this.paginated ? res.data : res;
              this.updating = false;
              this.pending = false;
              this.initialLoadComplete = true;
            }, 2000);
          })

          .catch(err => {
            this.history.push(["error", err, this]);
            this.error = err;
            this.pending = false;
            this.updating = false;
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
        data: {},
        paginated: null
      };
    },

    computed: {}
  };
</script>