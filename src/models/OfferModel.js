import {observable} from 'mobx';

export default class OfferModel {
	store;
	id;
	@observable title;
	@observable description;
	@observable imageUrl;
	@observable preMessage;
	@observable terms;
	@observable endingDate;
	@observable code;
	@observable couponLinks;



	constructor(data) {
		if (data) {
			this.store = data.store || "";

			this.title = data.title || "";
			this.description = data.description || "";
			this.imageUrl = data.imageUrl || "";
			this.preMessage = data.preMessage || "";
			this.terms = data.terms || "";
			this.endingDate = data.endingDate || "";
			this.code = data.code || "";
			// this.dateCreated = data.dateCreated || "";
			this.couponLinks = data.couponLinks || [];

		}
	}




	convertFromDB(offerDB) {
		this.title = offerDB.title;
		this.description = offerDB.description;
		this.imageUrl = offerDB.imageUrl;
		this.preMessage = offerDB.preMessage;
		this.terms = offerDB.terms;
		this.endingDate = offerDB.endingDate;
		this.code = offerDB.code;
		// this.dateCreated = offerDB.dateCreated;
		this.couponLinks = offerDB.couponLinks || [];
		this.id = offerDB.id;

	}

	convertToDB() {
		var offerDB = {}
		this.id ? offerDB.id = this.id : "";
		this.title ? offerDB.title = this.title : "";
		this.description ? offerDB.description = this.description : "";
		this.imageUrl ? offerDB.imageUrl = this.imageUrl : "";
		this.preMessage ? offerDB.preMessage = this.preMessage : "";
		this.terms ? offerDB.terms = this.terms : "";
		this.endingDate ? offerDB.endingDate = this.endingDate : new Date();
		this.code ? offerDB.code = this.code : "";
		// this.dateCreated ? offerDB.dateCreated = this.dateCreated : "";
		this.couponLinks ? offerDB.couponLinks = this.couponLinks.toJS() : "";

		return offerDB;
	}

	createLinks(clientsArray) {
		clientsArray.forEach((client) => {
			var offerClientLink = `${window.location.hostname}?offerId=${this.id}&clientId=${client.id}`;
			this.couponLinks.push(offerClientLink);
			client.offerLinks.push(offerClientLink);
			client.save();
		})
		this.store.save(this);
	}

	createLink(client,bussinessId) {


		var hostData = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
		var linkData = `/client-offer-preview/${this.id}/${client.id}/${bussinessId}`;
		var offerClientLink = `${hostData}${linkData}`;
		this.couponLinks.push(offerClientLink);
		client.offerLinks.push(offerClientLink);
		client.save();
		this.store.save(this);
		return linkData;
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
			key: this.key,
			endingDate: this.endingDate,
			// dateCreated: this.dateCreated,
			code: this.code,
			preMessage: this.preMessage,
			couponLinks: this.couponLinks
		};
	}

	static fromJS(store, object) {
		return new OfferModel({store:store,
			id:object.id,
			title:object.title,
			description:object.description,
			imageUrl:object.imageUrl,
			endingDate: object.endingDate,
			// dateCreated: object.dateCreated,
			preMessage: object.preMessage,
			couponLinks: object.couponLinks

		});
	}
}
