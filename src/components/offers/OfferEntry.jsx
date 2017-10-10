import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {hashHistory} from 'react-router';
import Promise from "bluebird";
import autobind from 'autobind-decorator'
import ImageUploader from 'react-firebase-image-uploader';
import * as firebase from 'firebase';
import OfferModel from '../../models/OfferModel'
import {observable, computed, action, extendObservable, toJS, autorun} from 'mobx';
import ReactTooltip from 'react-tooltip';
import moment from 'moment';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import DatePicker from 'material-ui/DatePicker';
import FontIcon from 'material-ui/FontIcon';
import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';
import ImageEditor from '../imageEditor/image-editor';

import './style.scss';

var tooltip = require('json!./info.json');

const ENTER_KEY = 13;

@observer
class OfferEntry extends React.Component {

	@observable
	state = {
		offer: {},
		canvas: null
	}

	static PropTypes = {
		offer: PropTypes.object
	}

	componentWillMount() {

		var {offerStore} = this.props.route.businessStore;
		const offerId = this.props.params.offerId;


		if (offerId) {
			var offer = offerStore.offers.find((it) => it.id == offerId);
			this.state.offer = offer;
			this.state.imageToEdit = offer.imageUrl;
		} else {
			this.state.offer = new OfferModel({store: this.props.route.businessStore.offerStore});
		}

		console.log(this.state.offer)
	}

	componentDidMount() {
		// this.state.offer.imageUrl && this.drawImage(this.state.offer.imageUrl);
		// this.state.canvas = document.getElementById('canvas');

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
		this.updateProperty(event.target.name, event.target.value)
	}

	@autobind
	onChangeDate(event, date) {
		this.updateProperty('endingDate', date)
	}


	@autobind
	handleNewOfferKeyDown(e) {
		e.preventDefault();
		this.state.offer.save();
		hashHistory.push('/offers');
		this.clearForm();

	};

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
	setImageSrc(src){
		this.state.offer.imageUrl = src;
	}


	render() {
		var {offer} = this.state;
		var offerProps = this.props.offer;
		var {route} = this.props;
		if (!firebase.storage || !route.businessStore.isInitialized) {
			return null;
		}

		return (
			<div>

				<Paper style={{marginTop: 20, paddingBottom: 20}}>
					<form className="addItemForm">

						<div className="row">
							<label>שם המבצע <span data-tip={tooltip.title} data-for='title'>?</span></label>
							<TextField name="title" defaultValue={offer.title} onChange={this.onChange}/>
							<ReactTooltip id="title"/>
						</div>
						<div className="row">
							<label>תיאור <span data-tip={tooltip.desc} data-for='desc'>?</span></label>
							<TextField multiLine name="description" defaultValue={offer.description}
									   onChange={this.onChange}/>
							<ReactTooltip id="desc"/>

						</div>
						<div className="row">
							<label>הודעה ללקוח<span data-tip={tooltip.message}
													data-for='message'>?</span></label>
							<TextField multiLine name="preMessage" value={offer.preMessage}
									   onChange={this.onChange}/>
							<ReactTooltip id="message"/>
						</div>
						<div className="row">
							<label>תנאים<span data-tip={tooltip.terms} data-for='terms'>?</span></label>
							<TextField name="terms" multiLine value={offer.terms} onChange={this.onChange}/>
							<ReactTooltip id="terms"/>
						</div>
						<div className="row">
							<label>בתוקף עד<span data-tip={tooltip.endDate} data-for='endDate'>?</span></label>
							<DatePicker autoOk name="endingDate" value={offer.endingDate} onChange={this.onChangeDate}
										formatDate={this.formatDate}/>
							<ReactTooltip id="endDate"/>
						</div>

					</form>

						<ImageEditor src={offer.imageUrl} onUpload={this.setImageSrc}  />


						<RaisedButton primary={true} style={{width: '95%', maxWidth: 320, margin: '10px auto', display: 'block'}}
									  onTouchTap={(e) => this.handleNewOfferKeyDown(e)}><span style={{color: "white"}}>שמור</span></RaisedButton>


				</Paper>
			</div>
		)
	}
}

export default OfferEntry;


