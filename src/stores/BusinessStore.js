import {observable, computed} from 'mobx';
import BusinessModel from '../models/BusinessModel';
import OfferStore from '../stores/OfferStore';
import ClientStore from '../stores/ClientStore';
import CouponStore from '../stores/CouponStore';
import {hashHistory } from 'react-router'
import * as firebase from 'firebase';

const LOGIN_PROVIDERS = {
    FACEBOOK: 'facebook',
    GOOGLE: 'google'
}


export default class BuisnessStore {
	@observable business = null;
	@observable initialize = false;
	offerStore = null;
	clientStore = null;
	couponStore = null;

	constructor() {
		this.offerStore = new OfferStore();
		this.clientStore = new ClientStore();
		this.couponStore = new CouponStore();
		this.startObserve()

	}

	init(business){
		this.business = business;
		this.offerStore.init(this.business);
		this.clientStore.init(this.business);
		this.couponStore.init(this.business);
		this.initialize = true;

	}


    startObserve(){
		//if(!this.disableAuthObserver) {

            firebase.auth().onAuthStateChanged((user) => {
                console.log("in")
                if (user && !this.business) {
                    this.login(user, user.refreshToken);
                } else {
                    this.initialize = true;

                }
            })
    }


	@computed get isLoggedIn(){
		return !!this.business ;
	}

	@computed get isInitialized(){
		return !!this.initialize ;
	}



	getProviderData(accessToken){
		return FB.api('/me',
			{fields: "id,last_name,first_name,picture,email"},{access_token:accessToken},
			function(response) {
				console.log('API response', response);

			}
		);
	}

    handleLoginSuccess(result) {
      //  disableAuthObserver = true;
        var token = result.credential.accessToken;
        debugger
        if(result.credential){
            var { user, credential } = result;
            return this.getProviderData(credential.accessToken);
            if(user){
                this.login(user, credential);
                return false;
            }
        }
        return false;

    }




    login(currentUser, credentials){
		return this.getBusiness(currentUser.uid)
			.then((business) => {
				if(!business) {
                    var business = this.addNewBusiness(currentUser, credentials);
                    this.init(business);
                }
                else {
					var businessModel = new BusinessModel();
					businessModel.convertFromDB(business);
					businessModel.store = this;
					this.init(businessModel);
				}
			})
	}


	logout(){
		var _this = this;
		return firebase.auth().signOut().then(() =>  {
			_this .business = null;
			hashHistory.push('/');

			return;
		})

	}

    getBusiness(id){
		return firebase.database().ref('/business/' + id).once('value').then(function(snapshot) {
			return  snapshot.val();
		});

	}

	save(businessModel){
		var businessModelDB = businessModel.convertToDB();
		businessModelDB.offers = this.offerStore.offers.map(o => o.convertToDB())
		businessModelDB.clients = this.clientStore.clients.map(o => o.convertToDB())
		return firebase.database().ref('/business').child(businessModelDB.id).set(businessModelDB);

	}


	addNewBusiness(currentUser, credentials) {
		var business = new BusinessModel(currentUser);
		return firebase.database().ref('/business').child(currentUser.uid).set(business);
        business.store = this;
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



