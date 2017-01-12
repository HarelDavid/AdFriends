import React from 'react';
import ReactDOM from 'react-dom'
import { Router, hashHistory } from 'react-router'

import routes from './Routes'
import OfferStore from './stores/OfferStore'
import ClientStore from './stores/ClientStore'

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

var offerStore = OfferStore.fromJS(initialState.offers);
var clientStore = ClientStore.fromJS(initialState.clients);

var stores = {};
stores.offerStore = offerStore;
stores.clientStore = clientStore;




ReactDOM.render((
  <Router history={hashHistory} routes={routes(stores)}>
  </Router>
), document.querySelector("#root"))
