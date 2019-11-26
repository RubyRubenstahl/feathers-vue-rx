import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;
import FeathersVueRx from "../../src";
Vue.use(FeathersVueRx)
new Vue({
  render: h => h(App)
}).$mount("#app");
