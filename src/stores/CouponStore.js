import {observable, computed} from 'mobx'
import CouponModel from '../models/CouponModel'
import * as Utils from '../utils';
import * as firebase from 'firebase';



export default class CouponStore {
	@observable coupons = [];
	couponRef = null

	constructor() {

	}

	init(business, isNew) {
	if (isNew){
			this.coupons = [];
	}
	else {
			this.couponRef = firebase.database().ref('coupons');
			this.couponRef.orderByChild("businessId").equalTo(business.id)
				.once('value').then((snapshot) => {
				var coupons = [];
				var couponsObj = snapshot.val();
				for (var key in couponsObj) {
					if (couponsObj.hasOwnProperty(key)) {
						var coupon = couponsObj[key];
						var couponModel = new CouponModel();
						couponModel.convertFromDB(coupon)
						coupons.push(couponModel);
					}
				}

				this.coupons = coupons;
			});
		}

	}


	getCouponsByOfferId(offerId){
		// this.couponRef = firebase.database().ref('coupons');
		return firebase.database().ref('coupons').orderByChild("offerId").equalTo(offerId).once("value").then((snapshot) => {
			var couponsById = snapshot.val();
			var coupons = [];
			if(couponsById) {

				for (var key in couponsById) {
					if (couponsById.hasOwnProperty(key)) {
						var coupon  = couponsById[key];
						var couponModel = new CouponModel();
						couponModel.convertFromDB(coupon)
						coupons.push(couponModel);
					}
				}

			}
			return coupons;
		});

	}



	getCoupon(id){
		return firebase.database().ref('/coupons/' + id).once('value').then((snapshot) => {
			var coupon  = snapshot.val();

				var couponModel = new CouponModel();
				couponModel.convertFromDB(coupon);
				couponModel.store = this;
				return couponModel;

		});

	}



	//add or update
	save(coupon) {

		if(!coupon.id){
			var couponId = `${coupon.offer.id}_${coupon.clientId}`
			coupon.id = couponId;
			coupon.store = this;
		}

		var hostData = 'http://coupon.adfriend.co.il';
		var linkData = `/coupon/${coupon.id}`;
		var couponsLink = `${hostData}${linkData}`;
		coupon.link = couponsLink;


		if(!this.coupons.find(it => it.id == coupon.id)) {
			this.coupons.push(coupon);
		}
		var couponDB = coupon.convertToDB();
		this.couponRef = firebase.database().ref('coupons');
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



