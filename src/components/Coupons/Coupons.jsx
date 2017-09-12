import React from 'react';
import {observer} from 'mobx-react';
import Coupon from './Coupon'
import {observable} from 'mobx';
import classname from 'classnames';
import autobind from 'autobind-decorator'
import {Link} from 'react-router'
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import {sortBy} from 'lodash';

import './style.scss';



@observer
export default class Coupons extends React.Component {

	componentWillMount(){
		var {businessStore, couponsStore} = this.props.route;

		couponsStore.init(businessStore.business);
		console.log('f')
	}




    render() {

		var {businessStore, couponsStore} = this.props.route;

		if(!couponsStore){
		    return null
        }

        return (

            <div className="offers-wrapper">
                <h1>קופונים</h1>


                <table className="offers-list">
					<tr>
						<th>נשלח אל</th>
						<th>מס׳ צפיות</th>
						<th>מס׳ מימושים</th>
						<th>קישור</th>
					</tr>
                    {sortBy(couponsStore.coupons, 'offerId').map((coupon) => (
                            <Coupon couponsStore={couponsStore} businessStore={businessStore} className="coupon" key={coupon.id} coupon={coupon}/>
                        )
                    )}
                </table>
            </div>


        )
    }
}

