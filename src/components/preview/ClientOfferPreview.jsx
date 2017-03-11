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


	componentDidMount(){
		this.couponStore = new CouponStore();
		this.couponStore.init();

		var couponId = this.props.routeParams.couponId;
		return this.couponStore.getCoupon(couponId)
			.then((coupon) => {

				console.log(coupon)
			})


	}


	render() {

		return <div>sss</div>

	}


}

export default ClientOfferPreview;
