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

		var  {businessStore} = this.props.route;
		var clientStore = businessStore.clientStore;

		return (

			<div className={style.wrapper}>
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

export default CSSModules(ClientList, style);
