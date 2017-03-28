import CSSModules from 'react-css-modules'
import React, {PropTypes} from 'react';
import {observer} from 'mobx-react';
import Client from './Client'
import ClientEntry from './ClientEntry'
import {observable} from 'mobx';


import style from './style.scss';



@observer
export default class ClientList extends React.Component {



	render() {

		var  {businessStore} = this.props;
		var clientStore = businessStore.clientStore;

		return (

			<div className="clients-wrapper">
				<div className="clients-list">
					<ClientEntry/>
					{clientStore.clients.map((client) => (
						<div className="client" key={client.id}>
							<div>{client.name}</div>
							<button>Send offer</button>
						</div>
						)
					)}
				</div>
			</div>


		)
	}
}

