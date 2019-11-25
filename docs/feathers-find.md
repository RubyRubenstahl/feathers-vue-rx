---
title: FeathersFind
---
# \<FeathersFind>


## Props
```JS
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
  }
```

## Slots
### loading
### loaded
### error
### empty


## Events
### loaded
Emitted when a `get` operation is successfully completed. The result is passed to along with the event. 

### error
Emitted when a `get` operation fails. The error object is passed with the event. 