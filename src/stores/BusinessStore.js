import {observable, computed} from 'mobx';
import BusinessModel from '../models/BusinessModel';
import OfferStore from '../stores/OfferStore';
import ClientStore from '../stores/ClientStore';
import {hashHistory } from 'react-router'
import * as firebase from 'firebase';




export default class BuisnessStore {
	@observable business = null;
	offerStore = null;
	clientStore = null;

	constructor() {
		this.offerStore = new OfferStore();
		this.clientStore = new ClientStore();
		this.startObserve();
	}

	init(business){
		this.business = business;
		this.offerStore.init(this.business);
		this.clientStore.init(this.business);
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

	@computed get isLoggedIn(){
		return !!this.business;
	}

	getProviderData(accessToken){


		return FB.api('/me',
			{fields: "id,last_name,first_name,picture,email"},{access_token:accessToken},
			function(response) {
				console.log('API response', response);

			}
		);


	}






	login(currentUser){
		//get business
		return this.getBuissnes(currentUser.uid)
			.then((business) => {
				if(business){

					this.init(business);
					//hashHistory.push('/offers');
				}
				else{

					var business =  this.add(currentUser);
					this.init(business);
					//hashHistory.push('/offers');


				}

			})
	}


	logout(){

		return firebase.auth().signOut().then(() =>  {
			this.business = null;
			hashHistory.push('/');

			return;
		})

	}

	getBuissnes(id){
		return firebase.database().ref('/business/' + id).once('value').then(function(snapshot) {
			return  snapshot.val();
		});

	}



	add(currentUser) {

		var business = new BusinessModel(currentUser.uid, currentUser.displayName, currentUser.photoURL);
		firebase.database().ref('/business').child(currentUser.uid).set(business);
		return business;


	}


	toJS() {
		return this.clients.map(client => client.toJS());
	}

	static fromJS(array) {
		// store.clients = array.map(item => ClientModel.fromJS(clientStore, item));
		return store;
	}
}



