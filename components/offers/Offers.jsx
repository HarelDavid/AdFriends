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
        isModalOpen: false
    }


    @autobind
    openOfferEntry(e) {
        e.preventDefault();
        this.state.isModalOpen = true;
    }

    @autobind
    closeModal() {
        this.state.isModalOpen = false;

    }


    render() {

        var {businessStore} = this.props.route;
        var offerStore = businessStore.offerStore;
        var {isModalOpen} = this.state;

        return (

            <div className={style.wrapper}>
                <h1>Your Offers:</h1>
                    <p>ניסיון של אורי</p>
                <ul className={style.list}>
                    <li className={style.new_item} onClick={(e) => this.openOfferEntry(e)}>
                        <div className={style.new}>
                            <span className={style.plus}>+</span>
                            Add New Offer
                        </div>
                        {isModalOpen ?
                            <Modal isOpen={isModalOpen} title="New Offer">
                                <div className="close" onClick={() => this.closeModal()}>X</div>
                                <OfferEntry offerStore={offerStore}/>
                            </Modal>
                            : null
                        }
                    </li>
                    {offerStore.offers.map((offer) => (
                            <Offer businessStore={businessStore} className={style.item} key={offer.id} offer={offer}/>
                        )
                    )}
                </ul>
            </div>


        )
    }
}

export default CSSModules(Offers, style);
