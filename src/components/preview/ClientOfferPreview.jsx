import React from 'react';
import {observer} from 'mobx-react';
import {observable, expr} from 'mobx';
import OfferStore from '../../stores/OfferStore';
import CouponStore from '../../stores/CouponStore';
import CSSModules from 'react-css-modules'
import autobind from 'autobind-decorator'
import classname from 'classnames';



@observer
class ClientOfferPreview extends React.Component {
	offerStore = {}
	couponStore = {};
	@observable
	state = {
		coupon: false
	}


	componentDidMount(){
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

	@autobind
	realizeCoupon(){

		var {coupon} = this.state;
		coupon.realized = true;
		coupon.save()
	}


	render() {

		return <button onClick={this.realizeCoupon} >ממש</button>

	}


}

export default ClientOfferPreview;
