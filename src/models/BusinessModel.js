import {observable} from 'mobx';

export default class BusinessModel {
	store;
	id;
	@observable title;
	@observable imageUrl;


	constructor(id, title, photoURL) {
		this.id = id;
		this.title = title;
		this.imageUrl = photoURL;

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
		return new ClientModel(store, object.id, object.title, object.description,object.imageUrl, object.key);
	}
}
