import React from 'react';
import {observer} from 'mobx-react';
import {observable, expr} from 'mobx';
import autobind from 'autobind-decorator'
import jsonpP from 'jsonp-p';
import {Link} from 'react-router';
import CouponModel from '../../models/CouponModel'
import {Creatable} from 'react-select';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import moment from 'moment';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import ClientModel from '../../models/ClientModel'
import Share from '../share';
import Dialog from 'material-ui/Dialog';

import './style.scss';


@observer
export default class Offer extends React.Component {

    @observable
    state = {
        offer: {},
        expended: false,
        chosenClient: {},
        link: "",
        client: {},
        dialogOpen: false,
        message: '',
        clientError: ''
    }

    componentWillMount() {
        const {offer, couponsStore} = this.props;

        this.state.offer = offer;

        this.clientStore = this.props.businessStore.clientStore;
        this.state.client = new ClientModel({store: this.props.businessStore.clientStore})

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

    @autobind
    createLink() {
        const {offer} = this.state;
        var {chosenClient, client} = this.state;
        var {businessStore, couponsStore} = this.props;
        var coupon = new CouponModel({store: couponsStore});
        coupon.businessId = businessStore.business.id;
        coupon.offer = offer.convertToDB();
        chosenClient.id ? coupon.clientId = chosenClient.id : coupon.clientId = client.id;
        coupon.message = this.state.message || offer.preMessage;
        coupon.bussineData = businessStore.business.convertToDB()

        if (!coupon.id) {
            var couponId = `${coupon.offer.id}_${coupon.clientId}`
            coupon.id = couponId;
        }
        var hostData = 'http://coupon.adfriend.co.il';
        var linkData = `/coupon/${coupon.id}`;
        coupon.link = `${hostData}${linkData}`;

        return this.bit_url(coupon.link)
            .then((res) => {
                this.state.link = coupon.shortLink = res.data.url;
                coupon.save();
                offer.couponLinks.push(coupon.link);
                offer.save();
                // client.couponLinks.push(coupon.link);
                client.save();
            })
    }

    bit_url(url) {
        var token = "fa85478c7a3069c8ef46957dd6d7b27f6433cb93";
        return jsonpP("https://api-ssl.bitly.com/v3/shorten?access_token=" + token + "&longUrl=" + url).promise
            .then(response => {
                return response
            })
            .catch(error => {
                console.log(error)
            });
    }


    getClientOption() {
        return this.clientStore.clients.map((it) => {
            return {'label': it.title, 'value': it.title, 'id': it.id}
        })
    }


    @autobind
    handleClientChoose(clientOption) {
        this.state.chosenClient = this.clientStore.clients.find((it) => it.id == clientOption.id)
        this.state.chosenClient.label = this.state.chosenClient.title;
        this.state.clientError = '';
        // console.log(clientOption, this.state.chosenClient)

    }

    @autobind
    onNewOptionClick(clientOption) {
        this.state.chosenClient = clientOption;
        this.state.client.title = clientOption.value;
        this.handleNewClient(clientOption);
        this.state.clientError = '';
    }


    @autobind
    handleToggle(event, toggle) {
        this.state.expanded = toggle;
    }


    @autobind
    openDialog() {
        if (this.state.chosenClient.label) {
            this.createLink();
            this.state.clientError = '';
            this.state.dialogOpen = true;
        }
        else {
            this.state.clientError = 'בחר לקוח';
        }
    }

    @autobind
    handleClose() {
        this.state.dialogOpen = false;

    };


    handleNewClient() {
        var {client} = this.state;

        if (client.label !== "") {
            client.save();
        }
    }



    render() {
        const {offer, dialogOpen, link, clientError} = this.state;

        var actions = [<FlatButton
            label="ביטול"
            primary={true}
            onTouchTap={this.handleClose}
        />,<a target="_blank" href={`${this.state.link}?preview=true`}>
            <RaisedButton label="תצוגה מקדימה" style={{marginTop: 20}} secondary/>
        </a>];

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
                        <p style={offerBoxDateStyle}>{isOVerDue ? 'פג תוקף ' : 'בתוקף עד: '}{moment(offer.endingDate).format('DD/MM/YY')}</p>
                        <Link to={`/offer/${offer.id}`} style={{textDecoration: 'none', marginLeft: 10}}>
                            <RaisedButton secondary label="ערוך"
                                          icon={<FontIcon className="material-icons" style={{fontSize: '1.2rem'}}>mode_edit</FontIcon>}/>
                        </Link>
                    </div>

                </CardActions>
                <CardText style={{padding: '10px 16px 16px', borderTop: '1px solid #f7f7f7'}}>
                    <p style={{marginTop: 0}}>שלח קופון:</p>
                    <div className="shareDialog">
                        <Creatable
                            name="client-select"
                            value={this.state.chosenClient}
                            options={this.getClientOption()}
                            onChange={this.handleClientChoose}
                            placeholder="הקלד שם לקוח"
                            onNewOptionClick={this.onNewOptionClick}
                        />
                        <div>
                            <RaisedButton secondary onClick={this.openDialog}>שלח
                                קופון</RaisedButton>
                            {dialogOpen &&
                            <Dialog
                                title="שלח קופון ללקוח"
                                actions={actions}
                                modal={false}
                                open={this.state.dialogOpen}
                                onRequestClose={this.handleClose}
                                contentStyle={{width: '90%', maxWidth: 500}}
                                actionsContainerClassName="shareDialogActions">

                               <Share offer={offer} link={link}/>
                            </Dialog>
                            }
                        </div>


                    </div>
                    <div style={{color: 'red'}}>{clientError}</div>
                </CardText>
            </Card>

        );
    }


}


