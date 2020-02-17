<template>
  <div v-if="!invisible" style="display:contents">
    <template v-if="!initialLoadComplete && !error && pending">
      <DelayRender>
        <slot name="loading" :data="data" :service="service">
          <component :is="feathers.defaultPendingComponent" />
        </slot>
      </DelayRender>
    </template>

    <template v-if="initialLoadComplete && !empty">
      <slot name="loaded" :data="data" :service="service" :clear="clear" :paginated="paginated" :pagination="pagination" :goNext="goNext" :goPrev="goPrev">
        {{ data }}
      </slot>
    </template>

    <template v-if="!!error">
      <slot name="error" :data="data" :service="service" :error="error">
        <component :is="feathers.defaultErrorComponent" :error="error" />
      </slot>
    </template>

    <template v-if="empty">
      <slot name="empty" :data="data" :service="service"
        ><component :is="feathers.defaultEmptyComponent" :service="service" :emptyMessage="emptyMessage"
      /></slot>
    </template>
    <slot></slot>
  </div>
</template>
<script>
import { isNumber } from "util";
import isEqual from "lodash.isequal";
import uniqBy from "lodash.uniqby";
import naturalCompare from "string-natural-compare";
import unionBy from 'lodash.unionby'

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
    },
    mergeChanges:{
      // Merge new data instead of replacing it. 
      type: Boolean,
      default: false
    },
    emptyMessage:{
      type: String,
      default: null
    },
    appendPages:{
      type:Boolean,
      default: false,

    },
    pendingComponent:{
      default:null
    }
  },
  mounted() {},
  componentWillUnmount() {
    this.querySubscription.unsubscribe();
  },
  methods: {
        clear(){
      this.data=null;
      this.pending=false;
      this.error = false;
      this.paginated = false;
    },
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
      if(this.paginated){
        params.query = {
          ...params.query,
          $skip: this.pagination.skip,
          $limit: this.pagination.limit
        }
      }

      this.querySubscription = service
        .watch(this.ervice)
        .find(params)
        .subscribe(
          res => {
            setTimeout(() => {
              this.history.push(["response", res, this]);
              this.intitialLoadComplete = true;
              this.paginated = isPaginated(res);

              if(this.paginated){
                const isLastPage = res.skip + res.limit > res.total
                const isFirstPage = res.skip===0;
                const self = this;
                const page =Math.floor(res.skip / res.limit)
                this.pagination = {
                  isFirstPage,
                  isLastPage,
                  total:res.total,
                  skip:res.skip,
                  limit: res.limit,
                  page,
                  pageCount: Math.floor(res.total/res.limit)+1,
                  prevPage: isFirstPage ? 0:page+1,
                  nextPage: isLastPage ? page :page+1,
                }
                this.pages[page] = res.data;
              }
              let data = this.paginated ? this.appendPages ? this.pages.flatMap(data=>data)  : res.data : res;

              // Prevent duplicates that can appear in some situations
              if (Array.isArray(data)) {
                data = uniqBy(data, this.idField);
              }
              if (this.sortBy && Array.isArray(data)) {
                data.sort((a, b) =>
                  naturalCompare(a[this.sortBy]||'', b[this.sortBy]||'', {
                    caseInsensitive: true
                  })
                );
              }

              // Merge data if  is enabled
              const shouldMergeChanges = this.mergeChanges && Array.isArray(this.data) && Array.isArray(data);
              this.data = shouldMergeChanges ? unionBy(data, this.data, this.idField) : data;

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
    },
    goNext(){
      this.pagination.skip = this.pagination.nextPage*this.pagination.limit;
      this.runQuery();
    },
    goPrev(){
      this.pagination.skip = this.pagination.prevPage*this.pagination.limit;
      this.runQuery();
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
      paginated: null,
      pages:[],
      pagination:{

      }
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
          this.pages = [];
          this.pagination={}
          
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
