import Vue from "vue";
import FeathersApp from "./FeathersApp";
import FeathersFind from "./FeathersFind";
import FeathersLogin from "./FeathersLogin";
import FeathersAuthenticated from "./FeathersAuthenticated";
import FeathersUnauthenticated from "./FeathersUnauthenticated";
import FeathersEdit from "./FeathersEdit";

Vue.component("FeathersApp", FeathersApp);
Vue.component("FeathersFind", FeathersFind);
Vue.component("FeathersLogin", FeathersLogin);
Vue.component("FeathersAuthenticated", FeathersAuthenticated);
Vue.component("FeathersUnauthenticated", FeathersUnauthenticated);
Vue.component("FeathersEdit", FeathersEdit);
