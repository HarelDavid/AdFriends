import {observable} from 'mobx';

export default class OfferModel {
	store;
	id;
	@observable title;
	@observable description;
	@observable preMessage;
	@observable terms;
	@observable offerGift;
	@observable clientGift;
	@observable endingDate;
	@observable code;
	@observable imageUrl;
	@observable key;

	constructor(store, id, title, description,preMessage,terms,offerGift,clientGift,endingDate,code, dateCreated,imageUrl,key) {
		this.store = store;
		this.id = id;
		this.title = title;
		this.description = description;
		this.preMessage = preMessage;
		this.terms = terms;
		this.offerGift = offerGift;
		this.clientGift = clientGift;
		this.endingDate = endingDate;
		this.code = code;
		this.dateCreated = dateCreated;
		this.imageUrl = imageUrl;
		this.key = key ;


	}

	destroy() {
		this.store.remove(this);//.offers.remove(this);
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
		return new OfferModel(store, object.id, object.title, object.description,object.imageUrl, object.key);
	}
}
