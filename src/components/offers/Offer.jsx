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
import FloatingActionButton from 'material-ui/FloatingActionButton';

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
		shareMsg: '',
		clientError: ''
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
			this.handleNewClient(clientOption)
		} else {
			this.state.chosenClient = this.clientStore.clients.find((it) => it.id == clientOption.value)
		}
		this.state.clientError = '';
	}

	@autobind
	handleToggle(event, toggle) {
		this.state.expanded = toggle;
	};


	@autobind
	openDialog() {
		if (this.state.chosenClient.id) {
			this.createLink();
			this.state.clientError = '';
			this.state.dialogOpen = true;
		}
		else {
			this.state.clientError = 'בחר לקוח';
		}
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
		this.state.message = event.target.value;
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
		window.open('http://web.whatsapp.com', '_blank');
	}


	render() {
		const {offer, dialogOpen, message, link, shareMsg, clientError} = this.state;
		const {businessStore, couponsStore} = this.props;
		var shareUrl = "whatsapp://send?text=" + (message || offer.preMessage) + " " + link;
		var actions = [<FlatButton
			label="ביטול"
			primary={true}
			onTouchTap={this.handleClose}
		/>,
			<a target="_blank" href={`${this.state.link}?preview=true`}>
				<RaisedButton label="תצוגה מקדימה" style={{marginTop: 20}} secondary/>
			</a>,
			<RaisedButton backgroundColor="#25D366">
				{this.isMobile() ?
					<a href={shareUrl} style={{color: '#fff', textDecoration: 'none'}}
					   className="whatsup-share-button">
						<FontIcon className="material-icons"
								  style={{
									  color: '#fff',
									  fontSize: 16,
									  marginLeft: 4,
									  verticalAlign: 'sub'
								  }}>share</FontIcon>
						שתף</a>
					:
					<span style={{color: '#fff'}} onClick={() => this.copyTextToClipboard(link)}><FontIcon
						className="material-icons"
						style={{color: '#fff', fontSize: 16, marginLeft: 4, verticalAlign: 'middle'}}>share</FontIcon> שתף</span>
				}
			</RaisedButton>];

		var isOVerDue = moment(offer.endingDate).isBefore(new Date());


		var offerBoxStyle = {margin: '20px 0', maxWidth: 500};
		var offerBoxDateStyle = null;
		if (isOVerDue) {
			offerBoxStyle = {
				...offerBoxStyle,
				background: "repeating-linear-gradient( 45deg,#fff,#fff 20px,#f6f6f6 20px,#f6f6f6 30px)",
				opacity: 0.7
			};
			offerBoxDateStyle = {
				color: 'red'
			}

		}

		return (

			<Card style={offerBoxStyle}>
				<CardHeader title={offer.title} style={{fontWeight: 'bold'}}/>
				<CardActions style={{display: 'flex', justifyContent: 'space-between'}}>
					<div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
						<p style={offerBoxDateStyle}>{isOVerDue ? 'פג תוקף ' : 'בתוקף עד: '}{moment(offer.endingDate).format('DD/MM/YY')}</p>
						<Link to={`/offer/${offer.id}`} style={{textDecoration: 'none', marginLeft: 10}}>
							<RaisedButton secondary label="ערוך"
										  icon={<FontIcon className="material-icons" style={{fontSize: '1.2rem'}}>mode_edit</FontIcon>}/>
						</Link>
					</div>

				</CardActions>
				<CardText>
					<div className="shareDialog">
						<Creatable
							name="form-field-name"
							value={this.state.chosenClient.id}
							options={this.getClientOption()}
							onChange={this.handleClientChoose}
							placeholder="שלח קופון"
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
								contentStyle={{width: '90%', maxWidth: 500}}
								actionsContainerClassName="shareDialogActions">

								<TextField label="הודעה ללקוח" multiLine={true} name="message"
										   defaultValue={offer.preMessage} hintText="שלח הודעה ללקוח"
										   onChange={this.updatePreMessage} style={{minWidth: 300}}/>
								<b style={{float: 'left'}}>{shareMsg}</b>
							</Dialog>
							}
						</div>


					</div>
					<div style={{color: 'red'}}>{clientError}</div>
				</CardText>
			</Card>

		);
	}


}


