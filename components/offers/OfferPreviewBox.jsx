import React, {PropTypes} from 'react';
import {observer} from 'mobx-react';
import {observable, expr} from 'mobx';
import CSSModules from 'react-css-modules'
import autobind from 'autobind-decorator'
import classname from 'classnames';
import Icon from '../icon';
import Modal from '../modal';
import ReactTooltip from 'react-tooltip'
import ClientList from '../Clients/Client-list';

import style from './style.scss';
Object.assign(style)


@observer
class OfferPreviewBox extends React.Component {

    static PropTypes = {
        openEditOffer: PropTypes.func,
        closeEditOffer: PropTypes.func
    }

    @observable
    state = {
        offer: {},
        itemBeingEdited: false,
        isModalOpen: false
    }

    componentWillMount() {
        const {offer} = this.props;
        this.state.offer = offer;
    }

    updateProperty(key, value) {
        var {offer} = this.state;
        offer[key] = value;
    }

    @autobind
    onChange(event) {
        this.updateProperty(event.target.name, event.target.value)
    }


    @autobind
    handleSubmit() {
        var {offer} = this.state;
        if (offer) {
            offer.save();
        }
    };

    @autobind
    handleDestroy() {
        var {offer} = this.state;
        if (offer) {
            offer.remove();
        }
    };


    @autobind
    openModal() {
        this.setState({isModalOpen: true})
    }

    @autobind
    closeModal() {
        this.setState({isModalOpen: false})
    }


    render() {
        const {offer, isModalOpen, itemBeingEdited} = this.state;
        const {businessStore, openEditOffer, closeEditOffer} = this.props;

        return (

                <div className={style.preview}>
                    <span className="icon-offers_full"></span>
                    <h3 className={style.cell}>
                        {offer.title}
                    </h3>
                    <div className={classname(style.cell, style.button_cell)}>
                        <button className="button edit" onClick={() => openEditOffer()}>edit</button>
                    </div>
                    <div className={classname(style.cell, style.button_cell)}>
                        Offer ends: {offer.endingDate}
                    </div>
                    <span className="share" onClick={() => this.openModal()}>share</span>

                    <Modal isOpen={isModalOpen} ref="share" title="Select a client:">
                        <div onClick={() => this.closeModal()}>X</div>
                        <ClientList businessStore={businessStore}/>
                    </Modal>

                </div>

        );
    }


}

export default CSSModules(OfferPreviewBox, style);
