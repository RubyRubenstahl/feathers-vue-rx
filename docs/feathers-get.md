---
title: FeathersGet
---
# \<FeathersGet>

Run a feathers get operation on a specific service

## Feathers object

## Props 

```JS
   props: {
      id: {
        // ID of the item to get
        type: String,
        required: true
      },
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
        // Name of the service to get from 
        type: String,
        required: "true"
      },
      idField: {
        // ID Field for the service
        type: String,
        default: "_id"
      },
      invisible: {
      // Hides default slots
      type: Boolean,
      default: false
      }
    }
```

## Events
### loaded
Emitted when a `get` operation is successfully completed. The result is passed to along with the event. 

### error
Emitted when a `get` operation fails. The error object is passed with the event. 

## Slots
### loading
### loaded
### error

