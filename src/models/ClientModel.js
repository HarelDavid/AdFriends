import {observable} from 'mobx';

export default class ClientModel {
	store;
	id;
	@observable title;
	@observable description;
	@observable imageUrl;
	//@observable preMessage;
	// @observable terms;
	// @observable clientGift;
	// @observable clientGift;
	// @observable endingDate;
	// @observable code;
	// @observable key;

	constructor(data){//preMessage,terms,clientGift,clientGift,endingDate,code, dateCreated) {
		if(data) {
			this.title = data.title || "";
			this.description = data.description || "";
			this.imageUrl = data.imageUrl || "";
			this.store = data.store || "";
		}


		// this.preMessage = preMessage;
		// this.terms = terms;
		// this.clientGift = clientGift;
		// this.clientGift = clientGift;
		// this.endingDate = endingDate;
		// this.code = code;
		// this.dateCreated = dateCreated;
	}

	converFromDB(clientDB) {
		this.title = clientDB.title;
		this.description = clientDB.description;
		this.imageUrl = clientDB.imageUrl;
		this.id = clientDB.id;

	}

	converToDB(clientDB) {
		var clientDB = {}
		clientDB.title = this.title || "";
		clientDB.description = this.description || "";
		clientDB.imageUrl = this.imageUrl || "";
		clientDB.id = this.id || "";
		return clientDB;
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
		return new ClientModel({store:store, id:object.id, title:object.title, description:object.description,imageUrl:object.imageUrl});
	}
}
