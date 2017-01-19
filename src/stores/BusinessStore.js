import {observable, computed} from 'mobx'
import BusinessModel from '../models/BusinessModel'
import * as Utils from '../utils';
import * as firebase from 'firebase';

export default class BuisnessStore {
	@observable business = null;

	constructor() {

		this.startObserve();
	}




	startObserve(){
		var _this = this;
		firebase.auth().onAuthStateChanged(function(user) {
			console.log(user)
			if (user && !_this.business) {
				_this.login(user);
			} else {
				return;
			}
		})

	}

	login(currentUser){
		//get business
		return this.getBuissnes(currentUser.uid)
			.then((business) => {
				if(business){
				  this.business  = business;
				}
				else{

					this.add(currentUser)
				}


			})
	}

	logout(){
		return firebase.auth().signOut().then(function() {
			this.business = null;
			return;
		}, function(error) {
			// An error happened.
		});

	}

	getBuissnes(id){
		return firebase.database().ref('/business/' + id).once('value').then(function(snapshot) {
			return  snapshot.val();
		});

	}



	add(currentUser) {

		var business = new BusinessModel(this, currentUser.uid, currentUser.displayName);
		var database = firebase.database();
		var offerRef = database.ref('/business');
		firebase.database().ref('/business').child(currentUser.uid).set(business);

	}


	toJS() {
		return this.clients.map(client => client.toJS());
	}

	static fromJS(array) {
		// store.clients = array.map(item => ClientModel.fromJS(clientStore, item));
		return store;
	}
}



