import CSSModules from 'react-css-modules'
import React, {PropTypes} from 'react';
import {observer} from 'mobx-react';
import Offer from './Offer'
import OfferEntry from './OfferEntry'
import {observable} from 'mobx';
import classname from 'classnames';
import autobind from 'autobind-decorator'
import Modal from '../modal';

import style from './style.scss';
Object.assign(style)


@observer
class Offers extends React.Component {

    @observable
    state = {
        offerEntryOpened: false
    }

    static propTypes = {
        showOverlay: PropTypes.func
    }

    @autobind
    openOfferEntry(e) {
        e.preventDefault();
        this.state.offerEntryOpened = true;
    }

    @autobind
    closeModal() {
        this.state.offerEntryOpened = false;

    }


    render() {

		var  {businessStore} = this.props.route;
		var offerStore = businessStore.offerStore;
        const {showOverlay} = this.props;

        return (

            <div className={style.wrapper}>
                <h1>Your Offers:</h1>

                <div className={style.top}>
                    <a className={classname(style.new, 'button')} onClick={(e) => this.openOfferEntry(e)}>+ Add New
                        Offer</a>
                    {this.state.offerEntryOpened ?
                        <Modal title="New Offer">
                            <div className="close" onClick={()=> this.closeModal()}>X</div>
                            <OfferEntry offerStore={offerStore} onSave={this.closeModal}/>
                        </Modal>
                        : null
                    }
                </div>
                <div className={style.list}>
                    {offerStore.offers.map((offer) => (
                            <Offer className={style.item} key={offer.id} offer={offer}/>
                        )
                    )}
                </div>
            </div>


        )
    }
}

export default CSSModules(Offers, style);
