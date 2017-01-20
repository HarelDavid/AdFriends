import {observable, computed} from 'mobx'
import OfferModel from '../models/OfferModel'
import * as Utils from '../utils';
import * as firebase from 'firebase';



export default class OfferStore {
	@observable offers = [];
	offersRef;


	constructor() {
		var _this = this;
		this.offersRef = firebase.database().ref('/offers');
		this.offersRef.on('value', (snap) => {
			snap.forEach((child) => {
				var item = child.val();
				var offerModel = new OfferModel();
				offerModel.converFromDB(item);
				offerModel.store = _this;
				this.offers.push(offerModel)
			})

		});
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
		var offerDB = offer.converToDB();
		this.offers.push(offerDB);
		this.offersRef.child(offerDB.id).set(offerDB);

	}

	remove (offer) {
		offer.destroy();
		this.offersRef.child(offer.key).remove();
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



