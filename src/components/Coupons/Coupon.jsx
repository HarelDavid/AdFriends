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
		coupon: {},
		expended: false,
		chosenClient: {},
		link: "",
		client: {},
	}

	componentWillMount() {
		const {coupon, couponsStore} = this.props;
		this.state.coupon = coupon;


	}


	updateProperty(key, value) {
		var {coupon} = this.state;
		coupon[key] = value;
	}

	@autobind
	onChange(event) {
		this.updateProperty(event.target.name, event.target.value)
	}


	@autobind
	handleSubmit() {
		var {coupon} = this.state;
		if (coupon) {
			coupon.save();
		}
	};

	@autobind
	handleDestroy() {
		var {coupon} = this.state;
		if (coupon) {
			coupon.remove();
		}
	};




	@autobind
	handleToggle(event, toggle) {
		this.setState({expanded: toggle});
	};




	render() {
		const {coupon} = this.state;
		const {businessStore, couponsStore} = this.props;


		return (

			<Card style={{margin: '20px 0'}}>
				<CardHeader
					title={coupon.title}
					actAsExpander={true}
					showExpandableButton={true}
					closeIcon={<FontIcon className="material-icons" style={{color: '#189d0e'}}>share</FontIcon>}
					openIcon={<FontIcon className="material-icons">expand_less</FontIcon>}
				/>
				{/*<CardActions style={{display: 'flex', justifyContent: 'space-between'}}>*/}
					{/*<p>בתוקף עד: {moment(offer.endingDate).format('DD/MM/YYYY')}</p>*/}
					{/*<Link to={`/offer/${offer.id}`}>*/}
						{/*<IconButton><FontIcon className="material-icons">mode_edit</FontIcon></IconButton>*/}
					{/*</Link>*/}
				{/*</CardActions>*/}

			</Card>

		);
	}


}


