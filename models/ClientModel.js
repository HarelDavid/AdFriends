import {observable} from 'mobx';

export default class ClientModel {
	store;
	id;
	@observable title;
	@observable description;

	constructor(store, id, name, offers, key) {
		this.store = store;
		this.id = id;
		this.name = name;
		this.offers = offers
		this.key = key ;


	}

	destroy() {
		this.store.remove(this);//.offers.remove(this);
	}

	toJS() {
		return {
			id: this.id,
			name: this.name,
			offers: this.offers,
			key: this.key
		};
	}

	static fromJS(store, object) {
		return new ClientModel(store, object.id, object.title, object.description,object.imageUrl, object.key);
	}
}
