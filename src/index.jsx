import React from 'react';
import ReactDOM from 'react-dom';
import { Router, hashHistory } from 'react-router';
import routes from './Routes';
import AuthStore from './stores/AuthStore';
import BuisnessStore from './stores/BusinessStore';
import CouponStore from './stores/CouponStore';

import * as firebase from 'firebase';

var configFirebase = {
	apiKey: "AIzaSyDieUaSUVR8dTDTsWb-UVkCXzkAn04G9KE",
	authDomain: "adfriend-73789.firebaseapp.com",
	databaseURL: "https://adfriend-73789.firebaseio.com",
	storageBucket: "adfriend-73789.appspot.com",
	messagingSenderId: "640171697438"
};
firebase.initializeApp(configFirebase);




const initialState = window.initialState || {
      offers:[],
		clients:[]
}

var authStore = new AuthStore();
var businessStore = new BuisnessStore();
var couponStore = new CouponStore();

var stores = {};
stores.authStore = authStore;
stores.businessStore = businessStore;
stores.couponStore = couponStore;
stores.couponStore.init();





ReactDOM.render((
  <Router history={hashHistory} routes={routes(stores)}>
  </Router>
), document.querySelector("#root"))
