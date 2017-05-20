import React from 'react';
import {observer} from 'mobx-react';
import {observable, expr} from 'mobx';
import OfferStore from '../../stores/OfferStore';
import CouponStore from '../../stores/CouponStore';
import autobind from 'autobind-decorator'
import classname from 'classnames';
import moment from 'moment';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

@observer
class ClientOfferPreview extends React.Component {
	offerStore = {}
	couponStore = {};
	@observable
	state = {
		coupon: null,
		formOpen: false,
		clientData: {},
		wrongCode: false
	}


	componentWillMount() {
		this.couponStore = new CouponStore();
		this.couponStore.init();

		var couponId = this.props.routeParams.couponId;
		var offerId = this.props.routeParams.offerId;
		return this.couponStore.getCoupon(couponId)
			.then((coupon) => {
				this.state.coupon = coupon;
				coupon.watches++;
				coupon.save();
			})

	}

	//this is just the preview - no need for realization
	@autobind
	realizeCoupon() {
		this.checkCode();
		this.state.wrongCode = false;
	}

	@autobind
	openForm() {
		this.state.formOpen = true;
	}

	@autobind
	onChange(event) {
		this.updateProperty(event.target.name, event.target.value)
	}

	updateProperty(key, value) {
		var {clientData} = this.state;
		clientData[key] = value;
	}

	@autobind
	checkCode() {
		var {coupon, clientData} = this.state;
		if (clientData['offerCode'] !== coupon.offer.code) {
			this.state.wrongCode = true;
			return false;
		}
	}


	render() {

		var {coupon, formOpen, wrongCode} = this.state;
		var {businessStore} = this.props.route;

		if (!coupon) {
			return null;
		}


		console.log(businessStore)
		return (
			<div className="Coupon">
				<div>
					<img src={coupon.offer.imageUrl}/>
					<h1>{coupon.offer.title}</h1>
					<p>{coupon.offer.description}</p>
					<p>בתוקף עד: {moment(coupon.offer.endingDate).format('DD/MM/YYYY')}</p>
				</div>

				<div className="Coupon-business">
				</div>

				<div className="Coupon-realization">

					<form>
						<TextField name="clientName" onChange={this.onChange} hintText="שם"/>
						<TextField name="clientEmail" onChange={this.onChange} hintText="כתובת מייל"/>
						<TextField name="offerCode" onChange={this.onChange} hintText="קוד קופון"/>
						{wrongCode && <p>הקוד שגוי</p> }
						<div className="form-button">
							<RaisedButton secondary onClick={this.realizeCoupon}>ממש</RaisedButton>
						</div>
					</form>

				</div>

			</div>
		);


	}


}

export default ClientOfferPreview;
