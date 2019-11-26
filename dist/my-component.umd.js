(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('vue'), require('../../../src/FeathersApp'), require('../../../src/FeathersFind'), require('../../../src/FeathersLogin')) :
	typeof define === 'function' && define.amd ? define(['vue', '../../../src/FeathersApp', '../../../src/FeathersFind', '../../../src/FeathersLogin'], factory) :
	(global = global || self, factory(global.Vue, global.FeathersApp, global.FeathersFind, global.FeathersLogin));
}(this, (function (Vue, FeathersApp, FeathersFind, FeathersLogin) { 'use strict';

	Vue = Vue && Vue.hasOwnProperty('default') ? Vue['default'] : Vue;
	FeathersApp = FeathersApp && FeathersApp.hasOwnProperty('default') ? FeathersApp['default'] : FeathersApp;
	FeathersFind = FeathersFind && FeathersFind.hasOwnProperty('default') ? FeathersFind['default'] : FeathersFind;
	FeathersLogin = FeathersLogin && FeathersLogin.hasOwnProperty('default') ? FeathersLogin['default'] : FeathersLogin;

	Vue.component("FeathersApp", FeathersApp);
	Vue.component("FeathersFind", FeathersFind);
	Vue.component("FeathersLogin", FeathersLogin);

})));
