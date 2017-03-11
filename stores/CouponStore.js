import {observable, computed} from 'mobx'
import OfferModel from '../models/OfferModel'
import * as Utils from '../utils';
import * as firebase from 'firebase';



export default class CouponStore {
	@observable coupons = [];

	constructor() {

	}

	init(){
		this.couponRef = firebase.database().ref('coupons');
	}



	getCoupon(id){
		return firebase.database().ref('/coupons/' + id).once('value').then(function(snapshot) {
			return  snapshot.val();
		});

	}



	//add or update
	save(coupon) {

		if(!coupon.id){
			var couponId = Utils.uuid();
			coupon.id = couponId;
			coupon.store = this;
		}

		var hostData = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
		var linkData = `/client-offer-preview/${coupon.id}`;
		var couponsLink = `${hostData}${linkData}`;
		coupon.link = couponsLink;

		this.coupons.push(coupon);
		var couponDB = coupon.converToDB();
		this.couponRef.child(couponDB.id).set(couponDB);
	}



	toJS() {
		return this.coupons.map(offer => offer.toJS());
	}

	static fromJS(array) {
		const store = new CouponStore();
		// store.offers = array.map(item => OfferModel.fromJS(offerStore, item));
		return store;
	}
}



