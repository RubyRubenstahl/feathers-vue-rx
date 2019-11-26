---
title: Getting Started
---

## Install
```JS
npm install --save feathers-vue-rx
```

## Register in Vue
```JS
import FeathersVueRx from "feathers-vue-rx";
Vue.use(FeathersVueRx)
```

## Use
```Vue
  <FeathersApp url="http://localhost:3030">
    <div>
        <h2>Users</h2>
        <FeathersFind service="users">
          <template slot="loaded" slot-scope="{ data: users }">
            <ul v-for="user in users" :key="user._id">
              <li> {{ user.username}} </li>
            </ul>
          </template>
        </FeathersFind>
      </div>  
  </FeathersApp>
```
