<template>
  <div style="display:contents">
    <template v-if="!!item">
      <slot
        name="form"
        :save="save"
        :item="item"
        :reset="reset"
        :isNewItem="isNewItem"
        :saving="saving"
        :fetchingItem="fetchingItem"
        :fetchError="fetchError"
        :saveError="saveError"
      >
        Edit
      </slot>
    </template>

  </div>
</template>
<script>
import FeathersError from "./FeathersError";

export default {
  name: "FeathersEdit",
  components: { FeathersError },
  inject: ["feathers"],
  data() {
    return {
      item: null,
      saving: false,
      saveError: null,
      loading: false,
      fetchingItem: false,
      fetchError: null,
      forceNew: false
    };
  },
  props: {
    id: {
      type: String
    },
    idField: {
      type: String,
      default: "_id"
    },
    service: {
      type: String,
      required: true
    },
    defaultItem: {
      type: Object,
      default: () => {}
    },
    resetOnCreate: {
      type: Boolean,
      default: true
    },
    allowNew:{
      // Create a new default item if fetch by Id fails. 
      type:Boolean,
      default: false
    }
  },
  computed: {
    isNewItem() {
      return !this.item || !this.item[this.idField] ||this.forceNew;
    }
  },
  methods: {
    save() {
      if (this.isNewItem) {
        this.createItem();
      } else {
        this.patchItem();
      }
    },
    fetchItem() {
      this.fetchingItem = true;
      this.fetchError = false;
      const self = this;

      this.feathers.app
        .service(self.service)
        .get(self.id)
        .then(res => {
          self.$set(this, "item", res);
          self.fetchingItem = false;
          self.fetchError = false;
        })
        .catch(err => {
          if(this.allowNew && err.name==='NotFound'){
            this.forceNew = true;
            console.error(`Item with id ${this.id} not found on service "${this.service}". Creating default item"`);
            this.item = this.defaultItem;
            return;
          }
          console.error(`Error fetching item from "${this.service}"`, err);
          self.fetchingItem = false;
          self.fetchError = true;
        });
    },
    patchItem() {
      console.log("patching");
      console.log(`Creating new item on ${this.service}`);
      const id = this.item[this.idField];
      delete this.item[this.idField]
      this.error = false;
      this.saving = true;
      const self = this;
      this.feathers.app
        .service(this.service)
        .patch(id, { ...this.item })
        .then(res => {
          self.saving = false;
          self.saveError = false;
          this.$emit("saved", res);
          return res;
        })
        .catch(err => {
          self.saving = false;
          self.saveError = err;
          this.$emit("error", err);
        });
    },
    createItem() {
      console.log(`Creating new item on ${this.service}`);
      this.error = false;
      this.saving = true;
      const self = this;
      this.forceNew = false;
      
      this.feathers.app
        .service(this.service)
        .create({ ...this.item })
        .then(res => {
          self.saving = false;
          self.saveError = false;
          if (self.resetOnCreate) {
            self.reset();
          }
          this.$emit("saved", res);
          return res;
        })
        .catch(err => {
          self.saving = false;
          self.saveError = err;
          this.$emit("error", err);
        });
    },
    reset() {
      console.log("Resetting");
      if (!this.defaultItem) {
        this.item = {};
      } else {
        this.item = { ...this.defaultItem };
      }
      this.$emit("reset");
    }
  },
  watch: {
    id: {
      immediate: true,
      handler(id, oldItem) {
        if (!id || id === "new") {
          this.reset();
        } else {
          this.fetchItem();
        }
      }
    }
  }
};
</script>
