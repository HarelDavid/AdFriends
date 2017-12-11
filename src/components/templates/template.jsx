import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {hashHistory} from 'react-router';
import classNames from 'classnames';
import autobind from 'autobind-decorator'
import * as firebase from 'firebase';
import OfferModel from '../../models/OfferModel'
import {observable, computed, action, extendObservable, toJS, autorun} from 'mobx';
import ReactTooltip from 'react-tooltip';
import moment from 'moment';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import Paper from 'material-ui/Paper';
import ImageEditor from '../imageEditor/image-editor';
import FontIcon from 'material-ui/FontIcon';
import {merge} from 'lodash';

import './style.scss';

const templates = require('json!./info.json');


@observer
export default class Template extends React.Component {

    @observable
    state = {
        offer: {},
        business: null
    }

    static PropTypes = {
        offer: PropTypes.object
    }

    componentWillMount() {

        var {offerStore} = this.props.route.businessStore;
        const offerId = this.props.params.offerId;
        const templateId = this.props.params.templateId;
        var {businessStore} = this.props.route;
        this.state.business = businessStore.business;

        if (offerId) {
            var offer = offerStore.offers.find((it) => it.id == offerId);
            this.state.offer = offer;
            this.state.imageToEdit = offer.imageUrl;
        } else if (templateId) {
            let offer = new OfferModel({store: this.props.route.businessStore.offerStore});
            this.state.offer = merge(offer,templates[templateId]);
        } else {
            hashHistory.push('/offers');
        }

        console.log(this.state.offer)
    }


    shouldComponentUpdate(nextProps, nextState) {

        if (this.state.offer !== nextState.offer) {
            return true;
        }
        return false;
    }

    updateProperty(key, value) {
        var {offer} = this.state;
        offer[key] = value;
    }

    @autobind
    onChange(event) {
        this.updateProperty(event.target.name, event.target.value);
        this.updateHeight(event.target);
    }

    @autobind
    onChangeDate(event, date) {
        this.updateProperty('endingDate', date)
    }


    @autobind
    handleNewOfferKeyDown(e) {
        e.preventDefault();

        // console.log(merge(this.state.offer,this.state.templateData));
        // merge(this.state.offer,this.state.templateData);

        this.state.offer.save();
        hashHistory.push('/offers');
        this.clearForm();

    };

    @autobind
    updateHeight(el){
        el.style.height = el.scrollHeight;
    }

    clearForm() {
        this.setState({description: ""});
        this.setState({title: ""});
    }

    @autobind
    goBack() {
        hashHistory.push('/offers');
    }

    @autobind
    formatDate(date) {
        return moment(date).format('DD/MM/YY')
    }

    @autobind
    setImageSrc(src) {
        this.state.offer.imageUrl = src;
    }




    render() {
        let {offer, business} = this.state,
            {route} = this.props,
            {templateId} = this.props.params;

        if (!firebase.storage || !route.businessStore.isInitialized) {
            return null;
        }

        let templateType = offer.templateId || templateId || "0",
            templateClass = classNames('Template', 'template-' + templateType),

            isOVerDue = offer && moment(offer.endingDate).isBefore(new Date()),
            telLink = 'tel:' + business.phone,
            iconStyles = {
                fontSize: 18,
                color: '#555',
                verticalAlign: 'middle',
                marginRight: 10
            },
            mapLink = 'https://maps.google.com/?q=' + business.address,
            termsDefaultValue = offer.terms ? ('*' + offer.terms) : null;



        return (
            <div className={templateClass}>


                <div className="Coupon-img">

                    <ImageEditor src={offer.imageUrl} onUpload={this.setImageSrc}  />

                    <div className="business-title">
                        <p>{business.title}</p>
                        <p>{business.description}</p>
                    </div>
                </div>
                <div className="Coupon-title">
                    {/*h1*/}
                    <div className="row h1">
                                <textarea type="text" name="title" defaultValue={offer.title}
                                          onChange={this.onChange}/>
                        <label htmlFor="title">כותרת</label>
                    </div>
                    {/*h2*/}
                    <div className="row h2">
							<textarea name="description" defaultValue={offer.description}
                                      onChange={this.onChange}/>
                        <label htmlFor="description">תיאור</label>
                    </div>
                </div>
                <Paper className="Coupon-inner-details">
                    {/*p*/}
                    <div className="row"><FontIcon className="material-icons"
                                                   style={iconStyles}>date_range</FontIcon>
                        <span className="betokef">בתוקף עד:</span>

                        <DatePicker autoOk name="endingDate"
                                    value={offer.endingDate || (moment().add(2, 'M')).toDate()}
                                    onChange={this.onChangeDate}
                                    formatDate={this.formatDate}/>
                    </div>
                </Paper>
                <div className="row terms">
                            <textarea name="terms"
                                      defaultValue={termsDefaultValue}
                                      onChange={this.onChange}/>
                    <label htmlFor="terms">תנאים והגבלות</label>
                </div>

                <Paper className="business-details">
                    <div className="details-row">
                        <p><FontIcon className="material-icons" style={iconStyles}>smartphone</FontIcon>
                            <a href={telLink}>{business.phone}</a></p>
                        {business.address && <p><FontIcon className="material-icons"
                                                          style={iconStyles}>location_on</FontIcon>
                            <a href={mapLink} target="_blank">
                                {business.address}</a></p>}
                        {business.website &&
                        <p><FontIcon className="material-icons" style={iconStyles}>link</FontIcon>
                            <a href={business.website} target="_blank">{business.website}</a></p>}
                    </div>
                </Paper>

                <div className="Coupon-realization">
                    <p>מעדיפים שנחזור אליכם? השאירו פרטים כאן:</p>
                    <form>
                        <TextField name="clientName" hintText="שם"/>
                        <TextField name="phoneNumber" hintText="מספר טלפון"/>
                        <div className="form-button">
                            <RaisedButton secondary>שלח</RaisedButton>
                        </div>
                    </form>

                    <a to="/terms" target="_blank" className="terms-link">כפוף לתנאי השימוש</a>
                </div>

                <div className="saveButtonHolder">

                <RaisedButton primary={true} label="שמור" onTouchTap={(e) => this.handleNewOfferKeyDown(e)}
                              style={{width: '95%', maxWidth: 320, margin: '10px auto', display: 'block'}}/>
                </div>
            </div>

        )
    }
}




