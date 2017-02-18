import React, {PropTypes} from 'react';
import {observer} from 'mobx-react';
import {observable, expr} from 'mobx';
import CSSModules from 'react-css-modules'
import autobind from 'autobind-decorator'
import classname from 'classnames';
import {Link} from 'react-router';
import Modal from '../modal';
import Select from 'react-select';

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
        chosenClient:{},
        link:"",
        itemBeingEdited: false,
        isModalOpen: false
    }

    componentWillMount() {
        const {offer} = this.props;
        this.clientStore = this.props.businessStore.clientStore;
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
        document.body.classList.add('showOverlay');

    }

    @autobind
    closeModal() {
        this.setState({isModalOpen: false})
        document.body.classList.remove('showOverlay');

    }

    getClientOption() {
       return this.clientStore.clients.map((it) => { return {'label':it.title,'value':it.id}})
    }

    @autobind
    handleClientChoose(clientOption) {
        this.state.chosenClient = this.clientStore.clients.find((it) => it.id == clientOption.value)
    }

    @autobind
    createLink(){
        const {offer} = this.state;
        var {chosenClient}  = this.state;
        debugger
        this.state.link = offer.createLink(chosenClient)
    }


    render() {
        const {offer, isModalOpen, itemBeingEdited} = this.state;
        const {businessStore, openEditOffer, closeEditOffer} = this.props;


        return (

                <div className={style.preview}>
                    <h3 className={style.cell}>
                        {offer.title}
                    </h3>
                    <div className={classname(style.cell, style.button_cell)}>
                        <button className="button edit" onClick={() => openEditOffer()}>edit</button>
                    </div>
                    <div className={classname(style.cell, style.button_cell)}>
                        Offer ends: {offer.endingDate}
                    </div>
                    <span className="share" onClick={() => this.openModal()}>Share</span>

                    <Modal isOpen={isModalOpen} ref="share" title="Select a client:">
                        <div onClick={() => this.closeModal()}>X</div>
						<Select
							name="form-field-name"
							value={this.state.chosenClient.id}
							options={this.getClientOption()}
                            onChange={this.handleClientChoose}
						/>

                        <div onClick={this.createLink}>create link</div>

                        {this.state.link && <Link to={this.state.link}>go to offer preview</Link>}

                    </Modal>

                </div>

        );
    }


}

export default CSSModules(OfferPreviewBox, style);
