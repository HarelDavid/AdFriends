import {observable} from 'mobx';

export default class OfferModel {
	store;
	id;
	@observable name;
	@observable phoneNumber;
	@observable dateAdded;
	@observable offerId;




	constructor(data) {
		if (data) {
			this.name = data.name || "";
			this.phoneNumber = data.phoneNumber || "";
			this.dateAdded = data.dateAdded || "";
			this.offerId = data.offerId || "";
		}
	}




	converFromDB(friendDB) {
		this.name = friendDB.name;
		this.phoneNumber = friendDB.phoneNumber;
		this.dateAdded = friendDB.dateAdded;
		this.offerId = friendDB.offerId;
		this.id = friendDB.id;

	}

	converToDB() {
		var friendDB = {}
		friendDB.name = this.name || "";
		friendDB.phoneNumber = this.phoneNumber || "";
		friendDB.dateAdded = this.dateAdded || "";
		friendDB.offerId = this.offerId || "";
		friendDB.id = this.offerId || "";
		return friendDB;
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
		return new OfferModel({store:store, id:object.id, title:object.title, description:object.description,imageUrl:object.imageUrl});
	}
}
