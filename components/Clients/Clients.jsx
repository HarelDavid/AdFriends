import CSSModules from 'react-css-modules'
import React, {PropTypes} from 'react';
import {observer} from 'mobx-react';
import Client from './Client'
import ClientEntry from './ClientEntry'
import {observable} from 'mobx';
import classname from 'classnames';
import autobind from 'autobind-decorator'
import Modal from '../modal';

import style from './style.scss';
Object.assign(style)


@observer
class Clients extends React.Component {

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
		const {showOverlay} = this.props;

		return (

			<div className={style.wrapper}>
				<h1>Your Clients:</h1>


				<div className={style.top}>
					<ClientEntry clientStore={clientStore}/>
				</div>

				<ul className={style.list}>
					{clientStore.clients.map((client) => (
							<Client className={style.item} key={client.id} client={client}/>
						)
					)}
				</ul>
			</div>


		)
	}
}

export default CSSModules(Clients, style);