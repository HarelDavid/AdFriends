import React from 'react';
import {observer} from 'mobx-react';
import {observable, expr} from 'mobx';
import {Link} from 'react-router';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';


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
console.log(coupon)

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


