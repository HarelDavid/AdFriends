import {observable} from 'mobx';

export default class ClientModel {
	store;
	id;
	@observable title;
	@observable description;
	@observable imageUrl;
	@observable friends;
	@observable couponLinks;


	constructor(data){
		if(data) {
			this.title = data.title || "";
			this.description = data.description || "";
			this.imageUrl = data.imageUrl || "";
			this.friends = data.friends || [];
			this.store = data.store || "";
			this.couponLinks = data.couponLinks || [];
		}

	}

	convertFromDB(clientDB) {
		this.title = clientDB.title;
		this.description = clientDB.description;
		this.imageUrl = clientDB.imageUrl;
		this.id = clientDB.id;
		this.couponLinks = clientDB.couponLinks || [];

	}

	convertToDB(clientDB) {
		var clientDB = {}
		clientDB.title = this.title || "";
		clientDB.description = this.description || "";
		clientDB.imageUrl = this.imageUrl || "";
		clientDB.couponLinks = this.couponLinks ? this.couponLinks.toJS() : "";
		clientDB.id = this.id || "";
		return clientDB;
	}

	addFriend(friend){
		this.friends.push(friend);
		this.save();
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
