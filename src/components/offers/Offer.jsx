import React from 'react';
import {observer} from 'mobx-react';
import {observable, expr} from 'mobx';
import CSSModules from 'react-css-modules'
import autobind from 'autobind-decorator'
import classname from 'classnames';
import Icon from '../icon';
import Modal from '../modal';
import ReactTooltip from 'react-tooltip'
import OfferPreviewBox from './OfferPreviewBox';
import OfferEntry from './OfferEntry';
import Paper from 'material-ui/Paper';

import style from './style.scss';
Object.assign(style)


@observer
export default class Offer extends React.Component {

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
    handleEdit() {
        this.state.itemBeingEdited = true;
    };

    @autobind
    openEditOffer() {
        this.setState({isModalOpen: true});
    }

    @autobind
    closeEditOffer() {
        this.setState({isModalOpen: false});
    }


    render() {
        const {offer, isModalOpen, itemBeingEdited} = this.state;
        const {businessStore, couponsStore} = this.props;


        return (
            <Paper className="offer-item">
                <OfferPreviewBox couponsStore={couponsStore} offer={offer} businessStore={businessStore} openEditOffer={this.openEditOffer}
                                 closeEditOffer={this.closeEditOffer}/>


            </Paper>
        );
    }


}


