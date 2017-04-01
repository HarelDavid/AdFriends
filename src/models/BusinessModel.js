import {observable} from 'mobx';

export default class BusinessModel {
	store;
	id;
	@observable title;
	@observable imageUrl;


	constructor(id, title, photoURL,store) {
		this.id = id;
		this.title = title;
		this.imageUrl = photoURL;
		this.store = store;

	}

	destroy() {
		this.store.remove(this);//.offers.remove(this);
	}

	save() {
		this.store.save(this);//.offers.remove(this);
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
