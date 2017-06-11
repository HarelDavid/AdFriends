import React from 'react';
import {observer} from 'mobx-react';
import Coupon from './Coupon'
import {observable} from 'mobx';
import classname from 'classnames';
import autobind from 'autobind-decorator'
import {Link} from 'react-router'
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';

import './style.scss';


@observer
export default class Coupons extends React.Component {

	componentDidMount(){
		console.log(this.props.route.couponsStore.coupons.toJS());
	}


    render() {

		var {businessStore, couponsStore} = this.props.route;

		if(!couponsStore){
		    return null
        }


        return (

            <div className="offers-wrapper">
                <h1>קופונים</h1>

                <div className="offers-list">
                    {couponsStore.coupons.map((coupon) => (
                            <Coupon couponsStore={couponsStore} businessStore={businessStore} className="coupon" key={coupon.id} coupon={coupon}/>

                        )
                    )}
                </div>
            </div>


        )
    }
}

