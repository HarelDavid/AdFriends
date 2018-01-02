import React from 'react';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import autobind from 'autobind-decorator'
import {Link} from 'react-router';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import moment from 'moment';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import Share from '../share';

import './style.scss';


@observer
export default class Offer extends React.Component {

    @observable
    state = {
        offer: {},
        link: "",
        dialogOpen: false,
        message: '',
    }

    componentWillMount() {
        const {offer, couponsStore} = this.props;

        this.state.offer = offer;

        return couponsStore.getCouponsByOfferId(offer.id)
            .then((res) => {
                return res
            })

    }


    updateProperty(key, value) {
        var {offer} = this.state;
        offer[key] = value;
    }


    @autobind
    onChange(event) {
        this.updateProperty(event.target.name, event.target.value)
    }


    @autobind
    handleDestroy() {
        var {offer} = this.state;
        if (offer) {
            offer.remove();
        }
    };


    render() {
        const {offer} = this.state,
            {couponsStore, businessStore} = this.props;


        var isOVerDue = moment(offer.endingDate).isBefore(new Date());


        var offerBoxStyle = {margin: '20px 0', maxWidth: 500};
        var offerBoxDateStyle = null;
        if (isOVerDue) {
            offerBoxStyle = {
                ...offerBoxStyle,
                background: "repeating-linear-gradient( 45deg,#fff,#fff 20px,#f6f6f6 20px,#f6f6f6 30px)",
                opacity: 0.7
            };
            offerBoxDateStyle = {
                color: 'red'
            }

        }

        return (

            <Card style={offerBoxStyle}>
                <CardHeader title={offer.title} style={{fontWeight: 'bold'}}/>
                <CardActions style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>

                        <p style={offerBoxDateStyle}>
                            {offer.endingDate &&
                            <span>{isOVerDue ? 'פג תוקף ' : 'בתוקף עד: '}{moment(offer.endingDate).format('DD/MM/YY')}</span>
                            }
                        </p>

                        <Link to={`/offer/${offer.id}`} style={{textDecoration: 'none', marginLeft: 10}}>
                            <RaisedButton secondary label="ערוך"
                                          icon={<FontIcon className="material-icons" style={{fontSize: '1.2rem'}}>mode_edit</FontIcon>}/>
                        </Link>
                    </div>

                </CardActions>
                <CardText style={{padding: '10px 16px 16px', borderTop: '1px solid #f7f7f7'}}>
                    <Share offer={offer} businessStore={businessStore} couponsStore={couponsStore}/>
                </CardText>
            </Card>

        );
    }


}


