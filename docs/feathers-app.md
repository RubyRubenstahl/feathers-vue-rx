---
title: FeathersApp
---

# \<FeathersApp>

## Props
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


## Feathers object
The `feathers` object is injected into all descendences of a `<FeathersApp>` component. 
```JS
  app:{
    // Featheers app
    type: Object
  },
  authenticating:{
    // True when the app authentication is pending
    type: Boolean
  },
  authenticated:{
    // True when a user is authenticated
    type: Boolean
  },
  authenticationError:{
    // Contains any error received during authentication
    type: Object
  },
  user:{
    // Contains the user object when a user is authenticated
    type: Object
  },
  connected:{
    // True if the app is connected over socketio
    type: Boolean
  },
  login:{
    // Log in with the supplied credentials. Returns a promise. 
    // login(Object credentials, String strategy) 
    // default strategy is "local". 
    type: Function
  },
  logout:{
    // Log out of the app. 
    type: Function
  },
  defaultEmptyComponent:{
    // Default component to use when no value is found
    type: VueComponent
  },
  defaultErrorComponent:{
    // Default component to use when an error is reported
    type: VueComponent
  },
  defaultPendingComponent:{
    // Default component to use when an operation is pending
    type: VueComponent
  },
  online:{
    // Browser is connected to the internet
    // Currently uses the navigator.online raw, which
    // is not entirely reliable.
    type: Boolean
  },
```

## Events
### logout
Emitted when the user has logged out

### login
Emitted when a user is logged in. 
The `user` object is passed with the event