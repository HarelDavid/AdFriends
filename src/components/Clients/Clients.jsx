import React from 'react';
import {observer} from 'mobx-react';
import Client from '../Clients/Client'
import ClientEntry from '../Clients/ClientEntry'

@observer
export default class Clients extends React.Component {

	render() {

		const {clientStore} = this.props.route;

		return (


			<div>
				<div>The Client :</div>
				{clientStore.clients.map((client) => (
						<Client key={client.title} client={client}/>
					)
				)}
				<ClientEntry clientStore ={clientStore}/>
			</div>


		)
	}
}
