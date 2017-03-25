import {observable, computed} from 'mobx'
import OfferModel from '../models/OfferModel'
import * as Utils from '../utils';
import * as firebase from 'firebase';



export default class OfferStore {
	@observable offers = [];
	business;
	offersRef;


	constructor() {

	}

	init(bussines){
		this.business = bussines;
		this.offersRef = firebase.database().ref(`business/${this.business.id}/offers`);
		var offersArr = bussines.offers ? Object.keys(bussines.offers).map(function(offer) { return bussines.offers[offer] }): [];
		offersArr.forEach((offer) => {
			var offerModel = new OfferModel();
			offerModel.convertFromDB(offer);
			offerModel.store = this;
			this.offers.push(offerModel)
		})
	}



	@computed get offerCount() {
		return this.offers.length;
	}

	//add or update
	save(offer) {

		if(!offer.id){
			var offerId = Utils.uuid();
			offer.id = offerId;
			offer.store = this;
		}
		this.offers.push(offer);
		var offerDB = offer.convertToDB();
		this.offersRef.child(offerDB.id).set(offerDB);
	}


	remove (offer) {
		this.offers.remove(offer);
		this.offers = this.offers.filter((offerInstace) => offerInstace.id != offer.id)
		this.offersRef.child(offer.id).remove();
	}
	toJS() {
		return this.offers.map(offer => offer.toJS());
	}

	static fromJS(array) {
		const store = new OfferStore();
		// store.offers = array.map(item => OfferModel.fromJS(offerStore, item));
		return store;
	}
}



