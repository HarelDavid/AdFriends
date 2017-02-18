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
class ClientList extends React.Component {



	render() {

		var  {businessStore} = this.props;
		var clientStore = businessStore.clientStore;

		return (

			<div className={style.wrapper}>
				<ul className={style.list}>
					<ClientEntry/>
					{clientStore.clients.map((client) => (
						<div className={style.item} key={client.id}>
							<div>{client.name}</div>
							<button>Send offer</button>
						</div>
						)
					)}
				</ul>
			</div>


		)
	}
}

export default CSSModules(ClientList, style);