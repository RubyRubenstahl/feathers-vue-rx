import Vue from "vue";
import App from "./App.vue";
import ReactiveProvide from "vue-reactive-provide";

Vue.config.productionTip = false;
Vue.use(ReactiveProvide);
import FeathersVueRx from "../../src";
Vue.use(FeathersVueRx)
new Vue({
  render: h => h(App)
}).$mount("#app");
