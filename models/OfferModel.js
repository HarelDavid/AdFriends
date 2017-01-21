import {observable} from 'mobx';

export default class OfferModel {
	store;
	id;
	@observable title;
	@observable description;
	@observable imageUrl;
	//@observable preMessage;
	// @observable terms;
	// @observable offerGift;
	// @observable clientGift;
	// @observable endingDate;
	// @observable code;
	// @observable key;

	constructor(data){//preMessage,terms,offerGift,clientGift,endingDate,code, dateCreated) {
		if(data) {
			this.title = data.title || "";
			this.description = data.description || "";
			this.imageUrl = data.imageUrl || "";
			this.store = data.store || "";
		}


		// this.preMessage = preMessage;
		// this.terms = terms;
		// this.offerGift = offerGift;
		// this.clientGift = clientGift;
		// this.endingDate = endingDate;
		// this.code = code;
		// this.dateCreated = dateCreated;
	}

	converFromDB(offerDB) {
		this.title = offerDB.title;
		this.description = offerDB.description;
		this.imageUrl = offerDB.imageUrl;
		this.id = offerDB.id;

	}

	converToDB(offerDB) {
		var offerDB = {}
		offerDB.title = this.title || "";
		offerDB.description = this.description || "";
		offerDB.imageUrl = this.imageUrl || "";
		offerDB.id = this.id || "";
		return offerDB;
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
