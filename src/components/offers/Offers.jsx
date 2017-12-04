import React from 'react';
import {observer} from 'mobx-react';
import Offer from './Offer'
import {Link} from 'react-router'
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import {sortBy} from 'lodash';


import './style.scss';


@observer
export default class Offers extends React.Component {


    render() {

        let {businessStore, couponsStore} = this.props.route;
        let offerStore = businessStore.offerStore;


        return (

            <div className="offers-wrapper">
                <h1>מבצעים</h1>
                <Link to="offer/new-offer" className="offer-new">
                    <RaisedButton primary={true} label="צור הצעה חדשה"
                                  icon={<FontIcon className="material-icons">event_note</FontIcon>}/>
                </Link>


                <div className="offers-list">
                    {sortBy(offerStore.offers, 'endingDate').reverse().map((offer, idx) => (
                            <Offer couponsStore={couponsStore} businessStore={businessStore} className="offer"
                                   key={offer.id} offer={offer}/>
                        )
                    )}
                </div>
            </div>


        )
    }
}

