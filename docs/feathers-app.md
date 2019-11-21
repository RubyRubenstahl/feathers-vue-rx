---
title: FeathersApp
---

# \<FeathersApp>

FeathersApp is the main wrapper component for feathers-vue-rx. It creates
a feathers application object along with other information such as connection
and authentication status, which are injected using the vue provide/inject
feature to provide information to contained components.

```JS
  props: {
    url: {
      type: String
      // URL of the feathers server
      // Example: http://localhost:3030
    },
    defaultIdField: {
      type: String,
      default: "_id"
      // Used by several components such as
      // FeatherEdit to as the default ID field for patching
      // Example: http://localhost:3030
    },
    defaultEmptyComponent: {
      type: Object,
      default: () => FeathersEmpty
      // Component to show when nothing is found
      // after a query. A default is already included,
      // but this allows you to specify your own.
      // It can be overridden per query component as well
    },
    defaultErrorComponent: {
      type: Object,
      default: () => FeathersError
      // Component to show when an error is returned
      // after a query. A default is already included,
      // but this allows you to specify your own.
      // It can be overridden per query component as well
    },
    defaultPendingComponent: {
      // Component to show when a query is pending
      // A default is already included, but this allows
      // you to specify your own. It can be overridden
      // per query component as well
      type: Object,
      default: () => FeathersPending
    }
```
