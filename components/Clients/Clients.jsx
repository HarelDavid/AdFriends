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
		e.preventDefault();
		this.state.clientEntryOpened = true;
	}

	@autobind
	closeModal() {
		this.state.clientEntryOpened = false;

	}


	render() {

		var  {businessStore} = this.props.route;
		var clientStore = businessStore.clientStore;
		const {showOverlay} = this.props;

		return (

			<div className={style.wrapper}>
				<h1>Your Clients:</h1>

                <a href="whatsapp://send?text=The text to share!" data-action="share/whatsapp/share">Share via Whatsapp</a>

				<div className={style.top}>
					<a className={classname(style.new, 'button')} onClick={(e) => this.openClientEntry(e)}>+ Add New
						Client</a>
					{this.state.clientEntryOpened ?
						<Modal title="New Client">
							<div className="close" onClick={()=> this.closeModal()}>X</div>
							<ClientEntry clientStore={clientStore} onSave={this.closeModal}/>
						</Modal>
						: null
					}
				</div>
				<div className={style.list}>
					{clientStore.clients.map((client) => (
							<Client className={style.item} key={client.id} client={client}/>
						)
					)}
				</div>
			</div>


		)
	}
}

export default CSSModules(Clients, style);
