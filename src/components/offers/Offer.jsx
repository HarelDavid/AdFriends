import React from 'react';
import {observer} from 'mobx-react';
import {observable, expr} from 'mobx';
import autobind from 'autobind-decorator'
import classname from 'classnames';
import {Link} from 'react-router';
import CouponModel from '../../models/CouponModel'
import {Creatable} from 'react-select';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import moment from 'moment';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import ClientModel from '../../models/ClientModel'
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';

import './style.scss';


@observer
export default class Offer extends React.Component {

	@observable
	state = {
		offer: {},
		expended: false,
		chosenClient: {},
		link: "",
		client: {},
		dialogOpen: false,
		message: '',
		shareMsg: ''
	}

	componentWillMount() {
		const {offer, couponsStore} = this.props;

		this.state.offer = offer;

		this.clientStore = this.props.businessStore.clientStore;
		this.state.client = new ClientModel({store: this.props.businessStore.clientStore})

		return couponsStore.getCouponsByOfferId(offer.id)
			.then((res) => {
				return res
			})

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
	handleDestroy() {
		var {offer} = this.state;
		if (offer) {
			offer.remove();
		}
	};

	@autobind
	createLink() {

		const {offer} = this.state;
		var {chosenClient}  = this.state;
		var {businessStore, couponsStore}  = this.props;
		var coupon = new CouponModel({store: couponsStore});
		coupon.businessId = businessStore.business.id;
		coupon.offer = offer.convertToDB();
		coupon.clientId = chosenClient.id;
		coupon.message = this.state.message || offer.preMessage;
		coupon.bussineData = businessStore.business.convertToDB()

		coupon.save();
		this.state.link = coupon.link;
		offer.couponLinks.push(coupon.link);
		offer.save();
		chosenClient.couponLinks.push(coupon.link);
		chosenClient.save();

	}

	getClientOption() {
		return this.clientStore.clients.map((it) => {
			return {'label': it.title, 'value': it.id}
		})
	}


	@autobind
	handleClientChoose(clientOption) {
		if (clientOption && clientOption.className) {
			this.state.chosenClient = clientOption;
			this.state.client.title = clientOption.value;
			this.handleNewClient(clientOption);
		} else {
			this.state.chosenClient = this.clientStore.clients.find((it) => it.id == clientOption.value)
		}
	}

	@autobind
	handleToggle(event, toggle) {
		this.state.expanded = toggle;
	};

	@autobind
	openDialog() {
		this.createLink();
		this.state.dialogOpen = true;
	}

	@autobind
	handleClose() {
		this.state.dialogOpen = false;

	};


	handleNewClient() {
		var {client} = this.state;

		if (client.label !== "") {
			client.save();
		}
	}


	@autobind
	updatePreMessage(event) {
		this.state.preMessage = event.target.value;
	}


	isMobile() {
		let mql = window.matchMedia('(max-width: 920px)');
		if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && mql.matches) {
			return true;
		}
		return false;
	}


	@autobind
	copyTextToClipboard(text) {
		var textArea = document.createElement("textarea");

		textArea.style.position = 'fixed';
		textArea.style.top = 0;
		textArea.style.left = 0;
		textArea.style.width = '2em';
		textArea.style.height = '2em';
		textArea.style.padding = 0;
		textArea.style.border = 'none';
		textArea.style.outline = 'none';
		textArea.style.boxShadow = 'none';
		textArea.style.background = 'transparent';
		textArea.value = text;
		document.body.appendChild(textArea);
		textArea.select();
		try {
			var successful = document.execCommand('copy');
			var msg = successful ? 'successful' : 'unsuccessful';
			this.state.shareMsg = 'לינק לקופון הועתק'
			console.log('Copying text command was ' + msg);
		} catch (err) {
			this.state.shareMsg = 'ארעה שגיאה, אנא נסה מאוחר יותר'
			console.log('Oops, unable to copy');
		}
		document.body.removeChild(textArea);
	}


	render() {
		const {offer, dialogOpen, message, link, shareMsg} = this.state;
		const {businessStore, couponsStore} = this.props;
		var shareUrl = "whatsapp://send?text=" + (message || offer.preMessage) + " " + link;
		var actions = [<FlatButton
			label="סגור"
			primary={true}
			onTouchTap={this.handleClose}
		/>,
			<RaisedButton backgroundColor="#25D366">
				{this.isMobile() ?
					<a href={shareUrl} style={{color: '#fff', fontSize: '18px', textDecoration: 'none'}}
					   className="whatsup-share-button">
						<FontIcon className="material-icons"
								  style={{color: '#fff', fontSize: 18, verticalAlign: 'sub'}}>share</FontIcon>
						שתף</a>
					:
					<span style={{color: 'white'}} onClick={()=> this.copyTextToClipboard(link)}><FontIcon className="material-icons"
								 style={{color: '#fff', fontSize: 18, verticalAlign: 'sub'}}>share</FontIcon> שתף</span>
				}
			</RaisedButton>];

		var isOVerDue = moment(offer.endingDate).isBefore(new Date());


		var offerBoxStyle = {margin: '20px 0'};
		var offerBoxDateStyle = null;
		if (isOVerDue) {
			offerBoxStyle = {
				...offerBoxStyle,
				background: "repeating-linear-gradient(45deg,#fff,rgba(0, 0, 0, 0.1) 20px,#fff 20px,rgba(0, 0, 0, 0.1) 20px)",
				opacity: 0.7
			};
			offerBoxDateStyle = {
				color: 'red'
			}
		}

		return (

			<Card style={offerBoxStyle}>
				<CardHeader
					title={offer.title}
					actAsExpander={true}
					showExpandableButton={!isOVerDue}
					closeIcon={<FontIcon className="material-icons">share</FontIcon>}
					openIcon={<FontIcon className="material-icons">expand_less</FontIcon>}
				/>
				<CardActions style={{display: 'flex', justifyContent: 'space-between'}}>
					<p style={offerBoxDateStyle}>{isOVerDue ? 'פג תוקף ' : 'בתוקף עד: '}{moment(offer.endingDate).format('DD/MM/YY')}</p>
					<Link to={`/offer/${offer.id}`}>
						<IconButton><FontIcon className="material-icons">mode_edit</FontIcon></IconButton>
					</Link>
				</CardActions>
				<CardText expandable={true}>
					<div className="shareDialog">
						<Creatable
							name="form-field-name"
							value={this.state.chosenClient.id}
							options={this.getClientOption()}
							onChange={this.handleClientChoose}
						/>
						<div>
							<RaisedButton secondary onClick={this.openDialog}>שלח
								קופון</RaisedButton>
							{dialogOpen &&
							<Dialog
								title="שלח קופון ללקוח"
								actions={actions}
								modal={false}
								open={this.state.dialogOpen}
								onRequestClose={this.handleClose}
								contentStyle={{width: '80%'}}>
								<TextField label="הודעה ללקוח" multiLine={true} name="message"
										   defaultValue={offer.preMessage} hintText="שלח הודעה ללקוח"
										   onChange={this.updatePreMessage}/>
								<b style={{float: 'left'}}>{shareMsg}</b>
								{/*<RaisedButton secondary onClick={this.createLink}>שלח</RaisedButton>*/}
							</Dialog>
							}
						</div>
						{this.state.link &&
						<a target="_blank" href={`${this.state.link}?preview=true`}><RaisedButton secondary>תצוגה
							מקדימה</RaisedButton></a>}
					</div>
				</CardText>
			</Card>

		);
	}


}


