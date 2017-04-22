import React, {PropTypes} from 'react';
import {observer} from 'mobx-react';
import Offer from './Offer'
import {observable} from 'mobx';
import classname from 'classnames';
import autobind from 'autobind-decorator'
import {Link} from 'react-router'
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';

import './style.scss';


@observer
export default class Coupons extends React.Component {



    render() {

        var {businessStore, couponsStore} = this.props.route;
        var offerStore = businessStore.offerStore;


        return (

            <div className="coupons-wrapper">
                <h1>קופונים</h1>
                <div className="coupons-list">
                    {offerStore.offers.map((offer) => (
                            <Offer couponsStore={couponsStore} businessStore={businessStore} className="offer" key={offer.id} offer={offer}/>

                        )
                    )}
                </div>
            </div>


        )
    }
}

