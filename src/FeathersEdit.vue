<template>
  <div>
    <template v-if="!!privateItem">
      <slot
        name="form"
        :save="save"
        :item="privateItem"
        :reset="reset"
        :isNewItem="isNewItem"
        :saving="saving"
      >
        Edit
      </slot>
    </template>

    <template v-if="!!error">
      <slot name="error" :error="error">
        <FeathersError :error="error" />
      </slot>
    </template>
  </div>
</template>
<script>
import FeathersError from "./FeathersError";

export default {
  name: "feathers-edit",
  components: { FeathersError },
  inject: ["feathers"],
  data() {
    return {
      privateItem: null,
      saving: false,
      error: null,
      loading: false
    };
  },
  props: {
    item: {
      type: Object
    },
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
      dafault: () => {}
    },
    resetOnCreate: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    isNewItem() {
      return !this.privateItem || !this.privateItem[this.idField];
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
    patchItem() {
      console.log("patching");
      console.log(`Creating new item on ${this.service}`);
      this.error = false;
      this.saving = true;
      const self = this;

      this.feathers.app
        .service(this.service)
        .patch(this.privateItem[this.idField], { ...this.privateItem })
        .then(res => {
          self.saving = false;
          self.error = false;
          return res;
        })
        .catch(err => {
          self.saving = false;
          self.error = err;
        });
    },
    createItem() {
      console.log(`Creating new item on ${this.service}`);
      this.error = false;
      this.saving = true;
      const self = this;

      this.feathers.app
        .service(this.service)
        .create({ ...this.privateItem })
        .then(res => {
          self.saving = false;
          self.error = false;
          if (self.resetOnCreate) {
            self.reset();
          }
          return res;
        })
        .catch(err => {
          self.saving = false;
          self.error = err;
        });
    },
    reset() {
      console.log("Resetting");
      if (!this.defaultItem) {
        this.privateItem = {};
      } else {
        this.privateItem = { ...this.defaultItem };
      }
    }
  },
  watch: {
    item: {
      immediate: true,
      deep: true,
      handler(item, oldItem) {
        // debugger;
        if (item) {
          this.privateItem = { ...item };
        } else {
          this.reset();
        }
      }
    }
  }
};
</script>
