import React from 'react';
import ReactDOM from 'react-dom';
import { Router, hashHistory } from 'react-router';
import routes from './Routes';
import AuthStore from './stores/AuthStore';
import BuisnessStore from './stores/BusinessStore';
import CouponStore from './stores/CouponStore';

import * as firebase from 'firebase';

//const isProd = process.env.NODE_ENV === 'production'
var configFirebase;

//todo : properly distinguish between prod to dev
var isProd = !(location.port == '8080');

if(isProd){
    configFirebase  = {
        apiKey: "AIzaSyA9hrvUvs6uBVvO2ianh5IQQp7qFjQB4OY",
        authDomain: "adfriendprod.firebaseapp.com",
        databaseURL: "https://adfriendprod.firebaseio.com",
        projectId: "adfriendprod",
        storageBucket: "adfriendprod.appspot.com",
        messagingSenderId: "370997730739"
    };

}
else  {
    configFirebase = {
        apiKey: "AIzaSyDieUaSUVR8dTDTsWb-UVkCXzkAn04G9KE",
        authDomain: "adfriend-73789.firebaseapp.com",
        databaseURL: "https://adfriend-73789.firebaseio.com",
        storageBucket: "adfriend-73789.appspot.com",
        messagingSenderId: "640171697438"
    };
}


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
//stores.couponStore.init();





ReactDOM.render((
<Router history={hashHistory} routes={routes(stores)} onUpdate={() => window.scrollTo(0, 0)}>
  </Router>
), document.querySelector("#root"))
