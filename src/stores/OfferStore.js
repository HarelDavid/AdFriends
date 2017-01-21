import {observable, computed} from 'mobx'
import OfferModel from '../models/OfferModel'
import * as Utils from '../utils';
import * as firebase from 'firebase';



export default class OfferStore {
	@observable offers = [];

	constructor() {

		var query = firebase.database().ref('/offers');

		query.on('value', (snap) => {
			snap.forEach((child) => {
				var item = {};
				item = child.val();
				item.key = child.key;
				this.offers.push(item)
			})

		});
	}

	@computed get offerCount() {
		return this.offers.length;
	}

	add(title, description, imageUrl) {
		var offerId = Utils.uuid();
		var offer = new OfferModel(this, offerId, title, description, imageUrl);
		this.offers.push(offer);
		var database = firebase.database();
		var offerRef = database.ref('/offers');
		firebase.database().ref('/offers').child(offerId).set(offer);

	}

	remove (offer) {

		offer.destroy();
		var database = firebase.database();
		var offersRef = database.ref('/offers');
		offersRef.child(offer.key).remove();

	}
	toJS() {
		return this.offers.map(offer => offer.toJS());
	}

	static fromJS(array) {
		console.log("array")
		const store = new OfferStore();
		// store.offers = array.map(item => OfferModel.fromJS(offerStore, item));
		return store;
	}
}



