import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {hashHistory} from 'react-router';
import classname from 'classnames';
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

import './style.scss';

const templates = require('json!./info.json');


@observer
export default class Template extends React.Component {

	@observable
	state = {
		offer: {},
		templateData: null
	}

	static PropTypes = {
		offer: PropTypes.object
	}

	componentWillMount() {

		var {offerStore} = this.props.route.businessStore;
		const offerId = this.props.params.offerId;
        const templateId = this.props.params.templateId;


		if (offerId) {
			var offer = offerStore.offers.find((it) => it.id == offerId);
			this.state.offer = offer;
			this.state.imageToEdit = offer.imageUrl;
		} else {
			this.state.offer = new OfferModel({store: this.props.route.businessStore.offerStore});
			// this.state.offer.template = templateId;
            this.state.templateData = templates[templateId];
        }

		console.log(this.state.templateData)
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
		let {offer, templateData} = this.state;
		let {route, classname} = this.props;
		if (!firebase.storage || !route.businessStore.isInitialized) {
			return null;
		}

		let templateClass = classname('Template', {})

		return (
			<div className={templateClass}>

				<Paper style={{marginTop: 20, paddingBottom: 20}}>

					<ImageEditor src={offer.imageUrl} onUpload={this.setImageSrc}  />

					<form className="addItemForm">

						<div className="row">
							<label htmlFor="title">כותרת</label>
							<textarea type="text" name="title" defaultValue={offer.title || templateData.title} onChange={this.onChange}/>
						</div>
						<div className="row">
							<label htmlFor="description">תיאור</label>

							<textarea name="description" defaultValue={offer.description || templateData.description}
									   onChange={this.onChange}/>
						</div>
						<div className="row">
							<label htmlFor="terms">תנאים והגבלות</label>

							<textarea name="terms" defaultValue={offer.terms || templateData.terms} onChange={this.onChange}/>
						</div>
						<div className="row">
							<label>בתוקף עד</label>
							<DatePicker autoOk name="endingDate" value={offer.endingDate || (moment().add(2, 'M')).toDate()} onChange={this.onChangeDate}
										formatDate={this.formatDate}/>
						</div>

					</form>


						<RaisedButton primary={true} style={{width: '95%', maxWidth: 320, margin: '10px auto', display: 'block'}}
									  onTouchTap={(e) => this.handleNewOfferKeyDown(e)}><span style={{color: "white"}}>שמור</span></RaisedButton>


				</Paper>
			</div>
		)
	}
}




