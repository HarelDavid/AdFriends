import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import * as firebase from 'firebase';
import {observable} from 'mobx';
import Share from '../share';
import Template from '../templates';

import './style.scss';


@observer
export default class OfferEntry extends React.Component {

    @observable
    state = {

    }

    static PropTypes = {
        offer: PropTypes.object
    }


    render() {
        var {offer, route} = this.props;

        if (!firebase.storage || !route.businessStore.isInitialized) {
            return null;
        }

        return (
            <div className="OfferEntry">

                <Share offer={offer}/>

                <Template/>

            </div>
        )
    }
}




