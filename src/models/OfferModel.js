import {observable} from 'mobx';
import moment from 'moment';

export default class OfferModel {
	store;
	id;
	@observable title;
	@observable description;
	@observable imageUrl;
	@observable thumbnail;
	@observable preMessage;
	@observable terms;
	@observable endingDate;
	@observable code;
	@observable couponLinks;
    @observable templateId;



	constructor(data) {
		if (data) {
			this.store = data.store || "";

			this.title = data.title || "";
			this.description = data.description || "";
			this.imageUrl = data.imageUrl || "";
			this.thumbnail = data.thumbnail || "";
			this.preMessage = data.preMessage || "";
			this.terms = data.terms || "";
			this.endingDate = data.endingDate ? data.endingDate :   "";
			this.code = data.code || "";
			// this.dateCreated = data.dateCreated || "";
			this.couponLinks = data.couponLinks || [];
			this.templateId = data.templateId || "";
		}
	}




	convertFromDB(offerDB) {
		this.title = offerDB.title;
		this.description = offerDB.description;
		this.imageUrl = offerDB.imageUrl;
		this.thumbnail = offerDB.thumbnail || "";
		this.preMessage = offerDB.preMessage;
		this.terms = offerDB.terms;
		this.endingDate = offerDB.endingDate ? new Date(offerDB.endingDate) : "";
		this.code = offerDB.code;
		// this.dateCreated = offerDB.dateCreated;
		this.couponLinks = offerDB.couponLinks || [];
		this.id = offerDB.id;
		this.templateId = offerDB.templateId || ""

	}

	convertToDB() {
		var offerDB = {}
		this.id ? offerDB.id = this.id : "";
		this.title ? offerDB.title = this.title : "";
		this.description ? offerDB.description = this.description : "";
		this.imageUrl ? offerDB.imageUrl = this.imageUrl : "";
		this.thumbnail ? offerDB.thumbnail = this.thumbnail : "";
		this.preMessage ? offerDB.preMessage = this.preMessage : "";
		this.terms ? offerDB.terms = this.terms : "";
		this.code ? offerDB.code = this.code : "";
		// this.dateCreated ? offerDB.dateCreated = this.dateCreated : "";
		this.couponLinks ? offerDB.couponLinks = this.couponLinks.toJS() : "";
		this.endingDate ? offerDB.endingDate = this.endingDate.getTime() : "";
		this.templateId ? offerDB.templateId = this.templateId : "";
		return offerDB;
	}


	//??//
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
			thumbnail: this.thumbnail,
			key: this.key,
			endingDate: this.endingDate,
			// dateCreated: this.dateCreated,
			code: this.code,
			preMessage: this.preMessage,
			couponLinks: this.couponLinks,
            templateId: this.templateId
		};
	}

	static fromJS(store, object) {
		return new OfferModel({store:store,
			id:object.id,
			title:object.title,
			description:object.description,
			imageUrl:object.imageUrl,
			thumbnail: object.thumbnail,
			endingDate: object.endingDate,
			// dateCreated: object.dateCreated,
			preMessage: object.preMessage,
			couponLinks: object.couponLinks,
            templateId: object.templateId

		});
	}
}
