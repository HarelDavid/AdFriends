import CSSModules from 'react-css-modules'
import React, {PropTypes} from 'react';
import {observer} from 'mobx-react';
import Client from './Client'
import ClientEntry from './ClientEntry'
import {observable} from 'mobx';
import classname from 'classnames';
import autobind from 'autobind-decorator'

import style from './style.scss';


@observer
export default class Clients extends React.Component {

	@observable
	state = {
		clientEntryOpened: false
	}

	static propTypes = {
		showOverlay: PropTypes.func
	}

	@autobind
	openClientEntry(e) {
		console.log("dd")
		e.preventDefault();
		this.state.clientEntryOpened = true;
	}


	render() {

		var  {businessStore} = this.props.route;
		var clientStore = businessStore.clientStore;

		return (

			<div className="Client-wrapper">
				<h1>לקוחות</h1>

				<div className="Client-top">
					<ClientEntry clientStore={clientStore}/>
				</div>

				<ul className="Client-table">
					{clientStore.clients.map((client) => (
							<Client className={style.item} key={client.id} client={client}/>
						)
					)}
				</ul>
			</div>


		)
	}
}


