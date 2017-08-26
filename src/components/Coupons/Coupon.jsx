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
import moment from 'moment';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import ClientModel from '../../models/ClientModel'

import './style.scss';


@observer
export default class Coupon extends React.Component {

	@observable
	state = {
		expended: false,
		chosenClient: {},
		link: "",
		client: {},
	}

	componentWillMount() {
		const {couponsStore, businessStore, coupon} = this.props;
	}



	render() {
		const {businessStore, coupon} = this.props;
		let client = businessStore.clientStore.clients.find(it=> (it.id == coupon.clientId));


		return (

			<tr style={{borderBottom: '1px solid #cbcbcb'}}>
				<td>
					{client.title}
				</td>
				<td>
					{coupon.watches}
				</td>
				<td>
					{coupon.realized}
				</td>
				<td>
					<a target="_blank" href={`${coupon.link}?preview=true`}>{coupon.offer.title}</a>
				</td>

			</tr>

		);
	}


}


