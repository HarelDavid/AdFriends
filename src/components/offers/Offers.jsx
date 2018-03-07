import React from 'react';
import {observer} from 'mobx-react';
import Offer from './Offer'
import {Link} from 'react-router'
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import {sortBy} from 'lodash';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

import './style.scss';


@observer
export default class Offers extends React.Component {


    state = {
        open: false,
    };

    openDialog = () => {
        this.setState({open: true});
    };

    closeDialog = () => {
        this.setState({open: false});
    };


    render() {

        let {businessStore, couponsStore} = this.props.route;
        let offerStore = businessStore.offerStore;
        const actions = [
            <FlatButton
                label="ביטול"
                primary={true}
                onClick={this.closeDialog}
            />
        ];


        return (

            <div className="offers-wrapper">
                <h1>מבצעים</h1>
                    <RaisedButton primary={true} label="צור הצעה חדשה" onClick={this.openDialog}
                                  icon={<FontIcon className="material-icons">event_note</FontIcon>}/>

                <Dialog
                    title="בחר טמפלט"
                    actions={actions}
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                >
                    <div style={{display: 'flex', justifyContent: 'space-around'}}>
                        <a href="/#/offer/new/0">מבצע</a>
                        <a href="/#/offer/new/1">כרטיס ביקור</a>
                    </div>

                </Dialog>

                <div className="offers-list">
                    {offerStore.offers.map((offer, idx) => (
                            <Offer couponsStore={couponsStore} businessStore={businessStore} className="offer"
                                   key={offer.id} offer={offer}/>
                        )
                    )}
                </div>
            </div>


        )
    }
}

