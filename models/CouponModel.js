import {observable} from 'mobx';

export default class CouponModel {
	store;
	id;
	@observable offer;
	@observable clientId;
	@observable businessId;
	@observable link;



	constructor(data){
		if(data) {
			this.offer = data.offer || "";
			this.clientId = data.clientId || "";
			this.businessId = data.businessId || "";
			this.link = data.link || [];
			this.store = data.store || [];
		}


	}

	converFromDB(couponDB) {

		this.offer = couponDB.offer;
		this.clientId = couponDB.clientId;
		this.businessId = couponDB.businessId;
		this.link = couponDB.link;
		this.id = couponDB.id;

	}

	converToDB() {

		var couponDB = {}
		couponDB.offer = this.offer || "";
		couponDB.clientId = this.clientId || "";
		couponDB.businessId = this.businessId || "";
		couponDB.link = this.link || "";
		couponDB.id = this.id || "";
		return couponDB;
	}

	save(){
		this.store.save(this);
	}

	destroy() {
		this.store.remove(this);
	}

	toJS() {
		return {
			id: this.id,
			title: this.title,
			description: this.description,
			imageUrl: this.imageUrl,
			key: this.key
		};
	}

	static fromJS(store, object) {
		return new ClientModel({store:store, id:object.id, title:object.title, description:object.description,imageUrl:object.imageUrl});
	}
}
