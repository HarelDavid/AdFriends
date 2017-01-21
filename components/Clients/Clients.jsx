import CSSModules from 'react-css-modules'
import React, {PropTypes} from 'react';
import {observer} from 'mobx-react';
import Client from './Clients'
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

        const {clientStore, businessStore} = this.props.route;
        const {showOverlay} = this.props;

        return (

			<div className={style.wrapper}>
				<h1>Your Clients:</h1>

				<div className={style.top}>
					<a className={classname(style.new, 'button')} onClick={(e) => this.openClientEntry(e)}>+ Add New
						Client</a>
                    {this.state.clientEntryOpened ?
						<Modal title="New Client">
							<div className="close" onClick={()=> this.closeModal()}>X</div>
							<ClientEntry clientStore={clientStore}/>
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
