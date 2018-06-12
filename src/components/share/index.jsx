import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import autobind from 'autobind-decorator'
import TextField from 'material-ui/TextField';
import FontIcon from 'material-ui/FontIcon';
import CouponModel from '../../models/CouponModel';
import ClientModel from '../../models/ClientModel'
import jsonpP from 'jsonp-p';
import {
    Step,
    Stepper,
    StepLabel,
    StepContent,
} from 'material-ui/Stepper';
import {copyTextToClipboard, isMobile} from '../../utils';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

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
        client: {},
        link: '',
        linkName: '',
        stepIndex: 0,
        stepsFinished: false,
    }

    componentWillMount() {
        this.clientStore = this.props.businessStore.clientStore;
        this.state.client = new ClientModel({store: this.props.businessStore.clientStore})
    }


    @autobind
    onChangeValue(event) {
        this.updateProperty(event.target.name, event.target.value);
        this.updateHeight(event.target);
    }

    @autobind
    updateHeight(el) {
        el.style.height = el.scrollHeight;
    }

    updateProperty(key, value) {

        this.state[key] = value;
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
    handleTabChange(value) {
        this.state.tabs.value = value;
    };


    @autobind
    createLink() {
        const {offer} = this.props;
        var {chosenClient, client, link, linkName} = this.state;
        var {businessStore, couponsStore} = this.props;
        var coupon = new CouponModel({store: couponsStore});
        coupon.businessId = businessStore.business.id;
        coupon.offer = offer.convertToDB();
        // chosenClient.id ? coupon.clientId = chosenClient.id : coupon.clientId = client.id;
        client.save();
        coupon.clientId = client.id;
        client.title = linkName || '';
        // coupon.name = linkName || '';
        coupon.message = this.state.message || '';
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
                offer.couponLinks.push({'url': coupon.shortLink, 'name': this.state.linkName, 'id': client.id});
                offer.save();
                // client.couponLinks.push(coupon.link);
                client.save();
            }).then(() => {
                this.handleNext();
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

    copyLink() {
        var {link} = this.state;
        copyTextToClipboard(link).then(res => {
            if (res === 'ok') {
                alert('text copied to clipboard')
            } else {
                alert(res);
            }
        })
    }

    @autobind
    openWebWhatsapp() {
        let {offer} = this.props,
            {message, link} = this.state;
        copyTextToClipboard(message ? message + "  " + link : link).then(res => {
            window.open('http://web.whatsapp.com', '_blank');
        })
    }

    @autobind
    onClickLink(el) {
        this.state.link = el.url;
        this.state.linkName = el.name;
        this.handleNext();
    }

    handleNext = () => {
        const {stepIndex} = this.state;
        this.setState({
            stepIndex: stepIndex + 1,
            finished: stepIndex >= 2,
        });
    };

    handlePrev = () => {
        const {stepIndex} = this.state;
        if (stepIndex > 0) {
            this.setState({stepIndex: stepIndex - 1});
        }
    };

    @autobind
    openFBdialog(){
        FB.ui({
            method: 'share',
            href: this.state.link,
        }, function(response){
            console.log(response)
        });
    }


    render() {
        let {offer} = this.props,
            {message, stepIndex, clientError, linkName, link} = this.state;
        let shareUrl = "whatsapp://send?text=" + message + " " + link;

        return (

            <div className="shareDialog">


                <Stepper activeStep={stepIndex} orientation="vertical">
                    <Step>
                        <StepLabel onClick={this.handlePrev} style={{color: 'rgba(66, 66, 66, 0.87)', fontSize: 14, fontWeight: 600, cursor: 'pointer'}}>צור קישור
                            חדש או בחר קישור קיים:</StepLabel>
                        <StepContent>
                            {/*{offer.couponLinks.length > 0 && <p style={{fontWeight: 500, textDecoration: 'underline'}}>רשימת קישורים קיימים:</p>}*/}
                            <ul className="links-list">
                                {offer.couponLinks.map(link => {
                                    return <li onClick={() => this.onClickLink(link)}>{link.name}</li>
                                })}
                            </ul>
                            <div className="link-new">
                                <input type="text" name="linkName"
                                       placeholder="הזן שם "
                                       onChange={this.onChangeValue}/>
                                <RaisedButton label="צור לינק חדש" style={{alignSelf: 'center'}} onClick={this.createLink}/>
                            </div>
                        </StepContent>
                    </Step>
                    <Step>
                        <StepLabel
                            style={{color: 'rgba(66, 66, 66, 0.87)', fontSize: 14, fontWeight: 600}}>שלח:</StepLabel>
                        <StepContent>
                            <div style={{textAlign: 'center'}}>
                                <a href={`${link}?preview=true`} target="_blank">{linkName} <span
                                    style={{fontSize: 11}}>(לחץ לתצוגה מקדימה)</span></a>
                                <TextField label="טקסט לשלוח עם הלינק" multiLine={true} name="message"
                                           defaultValue={message} hintText="הזן טקסט שיופיע בהודעת הווטסאפ או בפייסבוק"
                                           onChange={this.onChangeValue} style={{width: '100%', maxWidth: '300px', fontSize: 14}}/>

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
                                        <div className="whatsapp" onClick={this.openWebWhatsapp}>
                                            <svg width="22px" height="41px" viewBox="0 0 45 41">
                                                <g id="whatsapp_icon" fill="#FFFFFF" fillRule="nonzero">
                                                    <path
                                                        d="M44.129,30.344 C43.856,29.897 43.135,29.627 42.053,29.09 C40.969,28.553 35.643,25.952 34.653,25.596 C33.66,25.237 32.936,25.057 32.215,26.132 C31.494,27.208 29.418,29.627 28.785,30.344 C28.153,31.063 27.522,31.153 26.438,30.615 C25.356,30.078 21.867,28.942 17.73,25.281 C14.511,22.434 12.337,18.917 11.705,17.841 C11.074,16.766 11.639,16.185 12.18,15.65 C12.668,15.168 13.264,14.395 13.805,13.768 C14.348,13.14 14.528,12.693 14.887,11.975 C15.25,11.258 15.069,10.631 14.797,10.092 C14.527,9.555 12.359,4.267 11.457,2.116 C10.555,-0.035 9.654,0.323 9.021,0.323 C8.39,0.323 7.667,0.233 6.945,0.233 C6.223,0.233 5.049,0.502 4.056,1.577 C3.064,2.653 0.267,5.253 0.267,10.54 C0.267,15.828 4.146,20.937 4.689,21.654 C5.23,22.37 12.179,33.574 23.189,37.877 C34.2,42.177 34.2,40.742 36.186,40.562 C38.17,40.383 42.592,37.963 43.498,35.455 C44.398,32.943 44.398,30.792 44.129,30.344"/>
                                                </g>
                                            </svg>
                                        </div>
                                    }
                                    <div className="facebook" onClick={this.openFBdialog}>
                                        <svg width="12px" viewBox="0 0 192 384">
                                            <g id="facebook_icon" fill="#FFFFFF" fillRule="nonzero">
                                                <path
                                                    d="M128,128 L128,89.9 C128,72.7 131.8,64 158.5,64 L192,64 L192,0 L136.1,0 C67.6,0 45,31.4 45,85.3 L45,128 L2.84217094e-14,128 L2.84217094e-14,192 L45,192 L45,384 L128,384 L128,192 L184.4,192 L192,128 L128,128 Z"/>
                                            </g>
                                        </svg>
                                    </div>
                                    <div className="copy" onClick={() => this.copyLink()}><FontIcon
                                        className="material-icons"
                                        style={{color: '#fff'}}>content_copy</FontIcon>
                                    </div>
                                </div>
                            </div>
                            <FlatButton label="חזרה" onClick={this.handlePrev} style={{margin: '0 5px 5px 0', float: 'right'}}/>
                        </StepContent>
                    </Step>
                </Stepper>


            </div>



        );
    }
}

