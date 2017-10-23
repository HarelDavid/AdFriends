import {observable, computed} from 'mobx';
import BusinessModel from '../models/BusinessModel';
import OfferStore from '../stores/OfferStore';
import CouponModel from '../models/CouponModel'
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

		firebase.auth().onAuthStateChanged((user) => {
			if(!this.disableAuthObserver) {
				if (user && !this.business) {
					return this.login(user, user.refreshToken)
				} else {
					this.initialize = true;

				}
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

		return FB.api('/me', 'get', { access_token: accessToken, fields: 'id,last_name,first_name,gender,picture,email' }, (response) => {
			return response;
		});

	}

	handleLoginSuccess(result) {
		var { user, credential } = result;
		this.disableAuthObserver = true
		return Promise.resolve()
		.then(() => {
			if(credential) {
				return FB.api('/me', 'get', { access_token: credential.accessToken, fields: 'id,last_name,first_name,gender,picture,email' }, (providerData) => {
					return this.login(user, providerData)
				});
			}
		})
		.then(() => {
			this.disableAuthObserver = false
		})

	}




	login(currentUser, providerData){
		var isFirstTime = null
		return this.getBusiness(currentUser.uid)
			.then((business) => {
				if(!business) {
					this.addNewBusiness(currentUser, providerData)
						.then((business) => {
							this.init(business)
                             hashHistory.push('/settings');
						})

				}
				else {
					var businessModel = new BusinessModel();
					businessModel.convertFromDB(business);
					businessModel.store = this;
					this.init(businessModel);
                    //hashHistory.push('/offers');

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
        return Promise.all([
            firebase.database().ref('/business').child(businessModelDB.id).child('address').set(businessModelDB.address || ""),
            firebase.database().ref('/business').child(businessModelDB.id).child('businessType').set(businessModelDB.businessType || ""),
            firebase.database().ref('/business').child(businessModelDB.id).child('description').set(businessModelDB.description || ""),
            firebase.database().ref('/business').child(businessModelDB.id).child('email').set(businessModelDB.email || ""),
            firebase.database().ref('/business').child(businessModelDB.id).child('facebook').set(businessModelDB.facebook || ""),
            firebase.database().ref('/business').child(businessModelDB.id).child('firstName').set(businessModelDB.firstName || ""),
            firebase.database().ref('/business').child(businessModelDB.id).child('imageUrl').set(businessModelDB.imageUrl || ""),
            firebase.database().ref('/business').child(businessModelDB.id).child('phone').set(businessModelDB.phone || ""),
            firebase.database().ref('/business').child(businessModelDB.id).child('picture').set(businessModelDB.picture || ""),
            firebase.database().ref('/business').child(businessModelDB.id).child('title').set(businessModelDB.title || "")]

        ).then(() => {
            return firebase.database().ref('coupons').orderByChild("businessId").equalTo(businessModel.id).once("value").then((snapshot) => {
                    var couponsObj = snapshot.val();
                    if(couponsObj) {
                        for (var key in couponsObj) {
                            businessModelDB = businessModel.convertToDB();
                            if (couponsObj.hasOwnProperty(key)) {
                                var coupon = couponsObj[key];
                                firebase.database().ref('coupons').child(coupon.id).child('bussineData').set(businessModelDB)

                            }
                        }
                    }
                })
            })

	}


	addNewBusiness(currentUser, providerData) {
		var business = new BusinessModel(currentUser);
		business.picture = providerData.picture || ""
		business.firstName = providerData.first_name || ""
		business.lastName = providerData.last_name || ""
		business.email = providerData.email || ""
		var businessModelDB = business.convertToDB();
		return firebase.database().ref('/business').child(currentUser.uid).set(businessModelDB)
			.then(() => {
				business.store = this;
				return business;
			})
	}


	toJS() {
		return this.clients.map(client => client.toJS());
	}

	static fromJS(array) {
		// store.clients = array.map(item => ClientModel.fromJS(clientStore, item));
		return store;
	}
}



