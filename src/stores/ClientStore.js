import {observable, computed} from 'mobx'
import ClientModel from '../models/ClientModel'
import * as Utils from '../utils';
import * as firebase from 'firebase';

export default class ClientStore {
	@observable clients = [];

	constructor() {

		var query = firebase.database().ref('/clients');

		query.on('value', (snap) => {
			snap.forEach((child) => {
				var item = {};
				item = child.val();
				item.key = child.key;
				this.clients.push(item)
			})

		});
	}

	@computed get clientCount() {
		return this.clients.length;
	}

	add(title, description, imageUrl) {
		var clientId =  Utils.uuid();
		var client = new ClientModel(this, Utils.uuid(), title, description, imageUrl);
		this.clients.push(client);
		var database = firebase.database();
		var clientRef = database.ref('/clients');
		firebase.database().ref('/clients').child(clientId).set(client);//{

	}

	remove (client) {

		client.destroy();
		var database = firebase.database();
		var clientsRef = database.ref('/clients');
		clientsRef.child(client.key).remove();

	}
	toJS() {
		return this.clients.map(client => client.toJS());
	}

	static fromJS(array) {
		console.log("array")
		const store = new ClientStore();
		// store.clients = array.map(item => ClientModel.fromJS(clientStore, item));
		return store;
	}
}



