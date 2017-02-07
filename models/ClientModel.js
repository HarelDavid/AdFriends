import {observable} from 'mobx';

export default class ClientModel {
	store;
	id;
	@observable title;
	@observable description;
	@observable imageUrl;
	@observable friends;
	@observable offerLinks;


	constructor(data){
		if(data) {
			this.title = data.title || "";
			this.description = data.description || "";
			this.imageUrl = data.imageUrl || "";
			this.friends = data.friends || [];
			this.store = data.store || "";
		}

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
