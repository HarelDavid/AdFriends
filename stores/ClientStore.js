import {observable, computed} from 'mobx'
import ClientModel from '../models/ClientModel'
import * as Utils from '../utils';
import * as firebase from 'firebase';

export default class ClientStore {
	@observable clients = [];
	clientsRef;
	constructor() {



	}

	init(bussines){
		this.business = bussines;
		this.clientsRef = firebase.database().ref(`business/${this.business.id}/clients`);
		var clientsArr = bussines.clients ? Object.keys(bussines.clients).map(function(client) { return bussines.clients[client] }): [];
		clientsArr.forEach((client) => {
			var clientModel = new ClientModel();
			clientModel.convertFromDB(client);
			clientModel.store = this;
			this.clients.push(clientModel)
		})
	}

	@computed get clientCount() {
		return this.clients.length;
	}

	//add or update
	save(client) {

		if(!client.id){
			var clientId = Utils.uuid();
			client.id = clientId;
			client.store = this;
		}
		if(!this.clients.find(it => it.id == client.id)) {
			this.clients.push(client);
		}
		var  clientDB =  client.convertToDB();
		this.clientsRef.child(clientDB.id).set(clientDB);
	}


	remove (client) {
		this.clients.push(client);
		this.clients = this.clients.filter((clientInstace) => clientInstace.id != client.id)
		this.clientsRef.child(client.id).remove();
	}
	toJS() {
		return this.clients.map(client => client.toJS());
	}

	static fromJS(array) {

		const store = new ClientStore();
		// store.clients = array.map(item => ClientModel.fromJS(clientStore, item));
		return store;
	}
}



