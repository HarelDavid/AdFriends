import {observable} from 'mobx';

export default class ClientModel {
	store;
	id;
	@observable title;
	@observable description;

	constructor(store, id, title, description, imageUrl,key) {
		this.store = store;
		this.id = id;
		this.title = title;
		this.description = description;
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
		return new ClientModel(store, object.id, object.title, object.description,object.imageUrl, object.key);
	}
}
