import React from 'react';
import {observer} from 'mobx-react';
import {observable, expr} from 'mobx';
import CSSModules from 'react-css-modules'
import autobind from 'autobind-decorator'
import classname from 'classnames';
import Icon from '../icon';
import Modal from '../modal';
import ReactTooltip from 'react-tooltip'
import ClientList from '../Clients/client-list';

import style from './style.scss';
Object.assign(style)


@observer
class Offer extends React.Component {

    @observable
    state = {
        offer: {},
        itemBeingEdited: false,
        shareModal: true
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
    handleEdit() {
        this.state.itemBeingEdited = true;
    };

    @autobind
    closeModal() {
        this.state.itemBeingEdited = false;
        document.body.classList.remove('showOverlay');
    }

    openShareOffer(){
        this.state.shareModal = true;
    }

    render() {
        const {offer, shareModal, itemBeingEdited} = this.state;
        console.log("ssss",this.props)

        const {businessStore} = this.props;


        return (
            <li className={itemBeingEdited ? style.item + " edit" : style.item}>
                <div className={style.preview}>
                    <span className="icon-offers_full"></span>
                    <h3 className={style.cell}>
                        {offer.title}
                    </h3>
                    <div className={classname(style.cell, style.button_cell)}>
                        <button className="button edit" onClick={this.handleEdit}>edit</button>
                    </div>
                    <div className={classname(style.cell, style.button_cell)}>
                        Offer ends: {offer.endingDate}
                    </div>
                    <span className="share" onClick={()=> this.openShareOffer()}>share</span>
                    {shareModal &&
                    <Modal title="Select a client:">
                        <ClientList businessStore={businessStore} />
                    </Modal>
                    }
                </div>
                {itemBeingEdited ?

                    <Modal title="Edit Offer" className={style.edit_form}>
                        <div className="close" onClick={()=> this.closeModal()}>X</div>

                        <div className={style.cell}>
                            <label>Title <span className="tooltip" data-tip data-for="Title">?</span></label>
                            <ReactTooltip id='Title'>
                                <span>Title</span>
                            </ReactTooltip>
                            <input type="text" name="title" value={offer.title} onChange={this.onChange}/>
                        </div>
                        <div className={style.cell}>
                            <label>Description <span className="tooltip" data-tip
                                                     data-for="Description">?</span></label>
                            <ReactTooltip id='Description'>
                                <span>Description</span>
                            </ReactTooltip>
                            <input type="text" name="description" value={offer.description} onChange={this.onChange}/>
                        </div>
                        <div className={style.cell}>
                            <label>Message to Client <span className="tooltip" data-tip
                                                           data-for="Client">?</span></label>
                            <ReactTooltip id='Client'>
                                <span>Client</span>
                            </ReactTooltip>
                            <input type="text" name="preMessage" value={offer.preMessage} onChange={this.onChange}/>
                        </div>
                        <div className={style.cell}>
                            <label>Terms <span className="tooltip" data-tip data-for="Terms">?</span></label>
                            <ReactTooltip id='Terms'>
                                <span>Terms</span>
                            </ReactTooltip>
                            <input type="text" name="terms" value={offer.terms} onChange={this.onChange}/>
                        </div>
                        <div className={style.cell}>
                            <label>Friend Gift <span className="tooltip" data-tip data-for="Friend">?</span></label>
                            <ReactTooltip id='Friend'>
                                <span>Friend Gift </span>
                            </ReactTooltip>
                            <input type="text" name="offerGift" value={offer.offerGift} onChange={this.onChange}/>
                        </div>
                        <div className={style.cell}>
                            <label>Client Gift <span className="tooltip" data-tip data-for="ClientGift">?</span></label>
                            <ReactTooltip id='ClientGift'>
                                <span>Client Gift </span>
                            </ReactTooltip>
                            <input type="text" name="clientGift" value={offer.clientGift} onChange={this.onChange}/>
                        </div>
                        <div className={style.cell}>
                            <label>Date created <span className="tooltip" data-tip data-for="created">?</span></label>
                            <ReactTooltip id='created'>
                                <span>Date created</span>
                            </ReactTooltip>
                            <input type="date" name="dateCreated" value={offer.dateCreated} disabled/>
                        </div>
                        <div className={style.cell}>
                            <label>Ending Date <span className="tooltip" data-tip data-for="Ending">?</span></label>
                            <ReactTooltip id='Ending'>
                                <span>Ending date </span>
                            </ReactTooltip>
                            <input type="date" name="endingDate" value={offer.endingDate} onChange={this.onChange}/>
                        </div>
                        <div className={style.cell}>
                            <label>Code <span className="tooltip" data-tip data-for="Code">?</span></label>
                            <ReactTooltip id='Code'>
                                <span>Ending date </span>
                            </ReactTooltip>
                            <input type="text" name="code" value={offer.code} onChange={this.onChange}/>

                        </div>
                        <div className={style.urls}>
                            {offer.urls && offer.urls.map((url) =>
                                <div>{url}</div>
                            )}
                        </div>

                        <div className={classname(style.cell, style.image_cell)}>
                            <img src={offer.imageUrl}/>
                        </div>
                        <button className="button save" onClick={this.handleSubmit}>save</button>
                    </Modal> : null }

            </li>
        );
    }


}

export default CSSModules(Offer, style);
