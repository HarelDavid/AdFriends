import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {hashHistory} from 'react-router';

import autobind from 'autobind-decorator'
import * as firebase from 'firebase';
import OfferModel from '../../models/OfferModel'
import {observable, computed, action, extendObservable, toJS, autorun} from 'mobx';
import Share from '../share';
import Template from '../templates';

import moment from 'moment';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import Paper from 'material-ui/Paper';
import ImageEditor from '../imageEditor/image-editor';

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
        var {offer} = this.props;

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




