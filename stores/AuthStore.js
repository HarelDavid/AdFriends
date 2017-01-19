
import {observable, computed} from 'mobx'
import ClientModel from '../models/ClientModel'
import * as Utils from '../utils';
import * as firebase from 'firebase';
import firebaseui from 'firebaseui';

export default class AuthStore {
	@observable user = null;
	authUi  = null;
	constructor() {
		this.authUi =  new firebaseui.auth.AuthUI(firebase.auth());

	}

	// /**
	//  * Created by harel on 1/14/17.
	//  */
	// @computed get isLoggedIn() {
	// 	return !!this.user;
	// }
	//
	// startObserve(){
	// 	var _this = this;
	// 	firebase.auth().onAuthStateChanged(function(user) {
	// 		console.log(user)
	// 		if (user && !_this.user) {
	// 			_this.setUser(user);
	// 		} else {
	// 			return;
	// 		}
	// 	})
	//
	// }
	//
	//
	//
	// setUser(user){
	// 	this.user = user;
	// }
}



