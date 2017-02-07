import {observable} from 'mobx';

export default class OfferModel {
	store;
	id;
	@observable title;
	@observable description;
	@observable imageUrl;
	@observable preMessage;
	@observable terms;
	@observable offerGift;
	@observable clientGift;
	@observable endingDate;
	@observable code;
	@observable offerLinks;



	constructor(data) {
		if (data) {
			this.title = data.title || "";
			this.description = data.description || "";
			this.imageUrl = data.imageUrl || "";
			this.store = data.store || "";
			this.preMessage = data.preMessage || "";
			this.terms = data.terms || "";
			this.offerGift = data.offerGift || "";
			this.clientGift = data.clientGift || "";
			this.endingDate = data.endingDate || "";
			this.code = data.code || "";
			this.dateCreated = data.dateCreated || "";
			this.clientLinks = data.clientLinks || [];
		}
	}




	converFromDB(offerDB) {
		this.title = offerDB.title;
		this.description = offerDB.description;
		this.imageUrl = offerDB.imageUrl;
		this.preMessage = offerDB.preMessage;
		this.terms = offerDB.terms;
		this.offerGift = offerDB.offerGift;
		this.clientGift = offerDB.clientGift;
		this.endingDate = offerDB.endingDate;
		this.code = offerDB.code;
		this.dateCreated = offerDB.dateCreated;
		this.clientLinks = offerDB.clientLinks;
		this.id = offerDB.id;

	}

	converToDB() {
		var offerDB = {}
		this.id ? offerDB.id = this.id : "";
		this.title ? offerDB.title = this.title : "";
		this.description ? offerDB.description = this.description : "";
		this.description ? offerDB.description = this.description : "";
		this.imageUrl ? offerDB.imageUrl = this.imageUrl : "";
		this.preMessage ? offerDB.preMessage = this.preMessage : "";
		this.terms ? offerDB.terms = this.terms : "";
		this.offerGift ? offerDB.offerGift = this.offerGift : "";
		this.clientGift ? offerDB.clientGift = this.clientGift : "";
		this.endingDate ? offerDB.endingDate = this.endingDate : "";
		this.code ? offerDB.code = this.code : "";
		this.dateCreated ? offerDB.dateCreated = this.dateCreated : "";
		this.clientLinks ? offerDB.clientLinks = this.clientLinks : "";

		return offerDB;
	}

	createLinks(clientsArray) {
		clientsArray.forEach((client) => {
			var offerClientLink = `${window.location.hostname}?offerId=${this.id}&clientId=${client.id}`;
			this.offerLinks.push(offerClientLink);
			client.offerLinks.push(offerClientLink);
			client.save();
		})
		this.store.save(this);
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
