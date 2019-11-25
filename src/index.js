import FeathersApp from "./FeathersApp";
import FeathersFind from "./FeathersFind";
import FeathersLogin from "./FeathersLogin";
import FeathersAuthenticated from "./FeathersAuthenticated";
import FeathersUnauthenticated from "./FeathersUnauthenticated";
import FeathersEdit from "./FeathersEdit";
import FeathersGet from "./FeathersGet";

export default function initFeathers(Vue) {
    console.log('Registering feathers-vue-rx components');
    Vue.component("FeathersApp", FeathersApp);
    Vue.component("FeathersFind", FeathersFind);
    Vue.component("FeathersLogin", FeathersLogin);
    Vue.component("FeathersAuthenticated", FeathersAuthenticated);
    Vue.component("FeathersUnauthenticated", FeathersUnauthenticated);
    Vue.component("FeathersEdit", FeathersEdit);
    Vue.component("FeathersGet", FeathersGet);
    console.log('...feathers-vue-rx components registered');
}
