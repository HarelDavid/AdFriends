import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import autobind from 'autobind-decorator'
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {Creatable} from 'react-select';
import CouponModel from '../../models/CouponModel';
import ClientModel from '../../models/ClientModel'
import jsonpP from 'jsonp-p';

import {copyTextToClipboard, isMobile} from '../../utils';

import './style.scss';


@observer
export default class Share extends Component {

    static propTypes = {
        link: PropTypes.string,
        offer: PropTypes.object.isRequired,
        businessStore: PropTypes.object,
        couponsStore: PropTypes.object
    };

    @observable
    state = {
        message: "",
        shareMsg: "",
        dialogOpen: false,
        chosenClient: {},
        clientError: '',
        client: {}
    }

    componentWillMount() {
        this.clientStore = this.props.businessStore.clientStore;
        this.state.client = new ClientModel({store: this.props.businessStore.clientStore})
    }


    @autobind
    updatePreMessage(event) {
        this.state.message = event.target.value;
    }


    onClickCopy(str) {
        copyTextToClipboard(str).then(res => {
            console.log(res);
        })
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

    @autobind
    onNewOptionClick(clientOption) {
        this.state.chosenClient = clientOption;
        this.state.client.title = clientOption.value;
        this.handleNewClient();
        this.state.clientError = '';
    }

    @autobind
    handleClientChoose(clientOption) {
        this.state.chosenClient = this.clientStore.clients.find((it) => it.id == clientOption.id)
        this.state.chosenClient.label = this.state.chosenClient.title;
        this.state.clientError = '';
        // console.log(clientOption, this.state.chosenClient)

    }

    getClientOption() {
        return this.clientStore.clients.map((it) => {
            return {'label': it.title, 'value': it.title, 'id': it.id}
        })
    }


    @autobind
    createLink() {
        const {offer} = this.props;
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


    render() {
        let {offer, link} = this.props,
            {message, dialogOpen, clientError} = this.state;
        let shareUrl = "whatsapp://send?text=" + (message || offer.preMessage) + " " + link;

        let actions = [<FlatButton
            label="ביטול"
            primary={true}
            onTouchTap={this.handleClose}
        />, <a target="_blank" href={`${this.state.link}?preview=true`}>
            <RaisedButton label="תצוגה מקדימה" style={{marginTop: 20}} secondary/>
        </a>];

        return (

            <div className="shareDialog">
                    <p><b>שלח קופון:</b></p>
                <div className="choose-client">
                    <div>
                        <Creatable
                            name="client-select"
                            value={this.state.chosenClient}
                            options={this.getClientOption()}
                            onChange={this.handleClientChoose}
                            placeholder="הקלד שם לקוח"
                            onNewOptionClick={this.onNewOptionClick}
                        />
                        <div style={{color: 'red'}}>{clientError}</div>
                    </div>
                    <RaisedButton secondary onClick={this.openDialog} label="שלח קופון"/>
                </div>
                {dialogOpen &&
                <Dialog
                    title="שלח קופון ללקוח"
                    actions={actions}
                    modal={false}
                    open={this.state.dialogOpen}
                    onRequestClose={this.handleClose}
                    contentStyle={{width: '90%', maxWidth: 500}}
                    actionsContainerClassName="shareDialogActions">

                    <div className="Share">

                        <TextField label="הודעה ללקוח" multiLine={true} name="message"
                                   defaultValue={offer.preMessage} hintText="שלח הודעה ללקוח"
                                   onChange={this.updatePreMessage}/>

                        <RaisedButton backgroundColor="#25D366">
                            {isMobile() ?
                                <a href={shareUrl} style={{color: '#fff', textDecoration: 'none'}}
                                   className="whatsup-share-button">
                                    <FontIcon className="material-icons"
                                              style={{
                                                  color: '#fff',
                                                  fontSize: 16,
                                                  marginLeft: 4,
                                                  verticalAlign: 'sub'
                                              }}>share</FontIcon>
                                    שתף</a>
                                :
                                <span style={{color: '#fff'}}
                                      onClick={() => copyTextToClipboard(message ? message + "  " + link : offer.preMessage + "  " + link)}><FontIcon
                                    className="material-icons"
                                    style={{
                                        color: '#fff',
                                        fontSize: 16,
                                        marginLeft: 4,
                                        verticalAlign: 'middle'
                                    }}>share</FontIcon> שתף</span>
                            }
                        </RaisedButton>


                    </div>
                </Dialog>
                }


            </div>



        );
    }
}

