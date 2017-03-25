import React from 'react';
import {observer} from 'mobx-react';
import {observable, expr} from 'mobx';
import CSSModules from 'react-css-modules'
import autobind from 'autobind-decorator'
import classname from 'classnames';
import {Link} from 'react-router';
import CouponModel from '../../models/CouponModel'
import Select from 'react-select';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon';
import IconMenu from 'material-ui/IconMenu';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';

import './style.scss';



@observer
export default class Offer extends React.Component {

    @observable
    state = {
        offer: {},
        itemBeingEdited: false,
        isModalOpen: false,
        chosenClient: {}
    }

    componentWillMount() {
        const {offer, couponsStore} = this.props;
        this.state.offer = offer;
        this.clientStore = this.props.businessStore.clientStore;

        console.log(offer.id)

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
    handleSubmit() {
        var {offer} = this.state;
        if (offer) {
            offer.save();
        }
    };

    @autobind
    handleDestroy() {
        var {offer} = this.state;
        if (offer) {
            offer.remove();
        }
    };

    @autobind
    createLink(){
        const {offer} = this.state;
        var {chosenClient}  = this.state;
        var {businessStore, couponsStore}  = this.props;
        var coupon  = new CouponModel({store:couponsStore});
        coupon.businessId =  businessStore.business.id;
        coupon.offer =  offer.convertToDB();
        coupon.clientId =  chosenClient.id;
        coupon.save();
        this.state.link = coupon.link+ "/preview";
        offer.couponLinks.push(coupon.link);
        offer.save();
        chosenClient.couponLinks.push(coupon.link);
        chosenClient.save();

    }

    getClientOption() {
        return this.clientStore.clients.map((it) => {
            return {'label': it.title, 'value': it.id}
        })
    }

    @autobind
    handleClientChoose(clientOption) {
        this.state.chosenClient = this.clientStore.clients.find((it) => it.id == clientOption.value)
    }

    render() {
        const {offer} = this.state;
        const {businessStore, couponsStore} = this.props;


        return (
            <Paper className="offer-item">

                <div className="preview">
                    <h3 className="cell">
                        {offer.title}
                    </h3>
                    <div className="cell">
                        Offer ends: {}
                    </div>
                    <div className="cell">
                        <Link to={`/offer/${offer.id}`}>
                            <FloatingActionButton mini primary><FontIcon className="material-icons">mode_edit</FontIcon></FloatingActionButton>
                        </Link>
                        <FloatingActionButton primary mini>
                            <IconMenu iconButtonElement={<FontIcon className="material-icons">share</FontIcon>}
                                      anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                                      targetOrigin={{horizontal: 'right', vertical: 'top'}}>

                                <div className="shareDialog">
                                    <Select
                                        name="form-field-name"
                                        value={this.state.chosenClient.id}
                                        options={this.getClientOption()}
                                        onChange={this.handleClientChoose}/>

                                    <div onClick={this.createLink}>create link</div>

                                    {this.state.link && <Link to={this.state.link}>go to offer preview</Link>}
                                </div>
                            </IconMenu>
                        </FloatingActionButton>
                    </div>
                </div>


            </Paper>
        );
    }


}


