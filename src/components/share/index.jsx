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

import Facebook from '../../images/facebook_icon.svg';
import Whatsapp from '../../images/whatsapp_icon.svg';


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

        console.log(link)

        return (

            <div className="shareDialog">
                <p><b>שלח לינק:</b></p>

                <div>
                    <TextField label="שם הקידום" multiLine={true} name="message"
                               defaultValue={offer.preMessage} hintText="שם ייחודי ללינק שנוצר, למטרות מעקב וסטטיסטיקה."
                               onChange={this.updatePreMessage}/>
                    <TextField label="טקסט לשלוח עם הלינק" multiLine={true} name="message"
                               defaultValue={offer.preMessage} hintText="הזן טקסט שיופיע בהודעת הווטסאפ או בפייסבוק"
                               onChange={this.updatePreMessage}/>

                </div>

                <div className="share-social-buttons">
                    {isMobile() ?

                        <a className="whatsapp" href={shareUrl} style={{textDecoration: 'none'}}>
                            <svg width="22px" height="41px" viewBox="0 0 45 41">
                                <g id="whatsapp_icon" fill="#FFFFFF" fillRule="nonzero">
                                    <path
                                        d="M44.129,30.344 C43.856,29.897 43.135,29.627 42.053,29.09 C40.969,28.553 35.643,25.952 34.653,25.596 C33.66,25.237 32.936,25.057 32.215,26.132 C31.494,27.208 29.418,29.627 28.785,30.344 C28.153,31.063 27.522,31.153 26.438,30.615 C25.356,30.078 21.867,28.942 17.73,25.281 C14.511,22.434 12.337,18.917 11.705,17.841 C11.074,16.766 11.639,16.185 12.18,15.65 C12.668,15.168 13.264,14.395 13.805,13.768 C14.348,13.14 14.528,12.693 14.887,11.975 C15.25,11.258 15.069,10.631 14.797,10.092 C14.527,9.555 12.359,4.267 11.457,2.116 C10.555,-0.035 9.654,0.323 9.021,0.323 C8.39,0.323 7.667,0.233 6.945,0.233 C6.223,0.233 5.049,0.502 4.056,1.577 C3.064,2.653 0.267,5.253 0.267,10.54 C0.267,15.828 4.146,20.937 4.689,21.654 C5.23,22.37 12.179,33.574 23.189,37.877 C34.2,42.177 34.2,40.742 36.186,40.562 C38.17,40.383 42.592,37.963 43.498,35.455 C44.398,32.943 44.398,30.792 44.129,30.344"/>
                                </g>
                            </svg>
                            </a>
                        :
                        <div className="whatsapp"
                             onClick={() => copyTextToClipboard(message ? message + "  " + link : offer.preMessage + "  " + link)}>
                            <svg width="22px" height="41px" viewBox="0 0 45 41">
                                <g id="whatsapp_icon" fill="#FFFFFF" fillRule="nonzero">
                                    <path
                                        d="M44.129,30.344 C43.856,29.897 43.135,29.627 42.053,29.09 C40.969,28.553 35.643,25.952 34.653,25.596 C33.66,25.237 32.936,25.057 32.215,26.132 C31.494,27.208 29.418,29.627 28.785,30.344 C28.153,31.063 27.522,31.153 26.438,30.615 C25.356,30.078 21.867,28.942 17.73,25.281 C14.511,22.434 12.337,18.917 11.705,17.841 C11.074,16.766 11.639,16.185 12.18,15.65 C12.668,15.168 13.264,14.395 13.805,13.768 C14.348,13.14 14.528,12.693 14.887,11.975 C15.25,11.258 15.069,10.631 14.797,10.092 C14.527,9.555 12.359,4.267 11.457,2.116 C10.555,-0.035 9.654,0.323 9.021,0.323 C8.39,0.323 7.667,0.233 6.945,0.233 C6.223,0.233 5.049,0.502 4.056,1.577 C3.064,2.653 0.267,5.253 0.267,10.54 C0.267,15.828 4.146,20.937 4.689,21.654 C5.23,22.37 12.179,33.574 23.189,37.877 C34.2,42.177 34.2,40.742 36.186,40.562 C38.17,40.383 42.592,37.963 43.498,35.455 C44.398,32.943 44.398,30.792 44.129,30.344"/>
                                </g>
                            </svg>
                        </div>
                    }
                    <div className="facebook">
                        <svg width="12px" viewBox="0 0 192 384">
                            <g id="facebook_icon" fill="#FFFFFF" fillRule="nonzero">
                                <path
                                    d="M128,128 L128,89.9 C128,72.7 131.8,64 158.5,64 L192,64 L192,0 L136.1,0 C67.6,0 45,31.4 45,85.3 L45,128 L2.84217094e-14,128 L2.84217094e-14,192 L45,192 L45,384 L128,384 L128,192 L184.4,192 L192,128 L128,128 Z"/>
                            </g>
                        </svg>
                    </div>
                    <div className="copy" onClick={() => copyTextToClipboard(link)}><FontIcon className="material-icons" style={{color: '#fff'}}>content_copy</FontIcon></div>
                </div>


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
                    <RaisedButton secondary onClick={this.openDialog} label="שלח לינק"/>
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
                                    <FontIcon className="material-icons">share</FontIcon>
                                    שתף</a>
                                :
                                <span style={{color: '#fff'}}
                                      onClick={() => copyTextToClipboard(message ? message + "  " + link : offer.preMessage + "  " + link)}><FontIcon
                                    className="material-icons"
                                    >share</FontIcon> שתף</span>
                            }
                        </RaisedButton>


                    </div>
                </Dialog>
                }


            </div>



        );
    }
}

