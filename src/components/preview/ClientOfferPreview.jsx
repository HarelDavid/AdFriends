import React from 'react';
import {observer} from 'mobx-react';
import {observable, expr} from 'mobx';
import OfferStore from '../../stores/OfferStore';
import CouponStore from '../../stores/CouponStore';
import CSSModules from 'react-css-modules'
import autobind from 'autobind-decorator'
import classname from 'classnames';
import moment from 'moment';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

@observer
class ClientOfferPreview extends React.Component {
    offerStore = {}
    couponStore = {};
    @observable
    state = {
        coupon: null,
        formOpen: false,
        clientData: null,
        wrongCode: false
    }


    componentWillMount() {
        this.couponStore = new CouponStore();
        this.couponStore.init();

        var couponId = this.props.routeParams.couponId;
        var offerId = this.props.routeParams.offerId;
        return this.couponStore.getCoupon(couponId)
            .then((coupon) => {
                this.state.coupon = coupon;
                coupon.watches++;
                coupon.save();
            })


    }

    @autobind
    realizeCoupon() {

        var {coupon} = this.state;
        coupon.realized = true;
        coupon.save()
    }

    @autobind
    openForm() {
        this.state.formOpen = true;
    }

    @autobind
    onChange(event) {
        this.updateProperty(event.target.name, event.target.value)
    }

    updateProperty(key, value) {
        var {clientData} = this.state;
        clientData[key] = value;
    }

    @autobind
    checkCode(e) {
        var {coupon} = this.state;
        if (e.target.value !== coupon.offer.code) {
            this.state.wrongCode = true;
        }
    }


    render() {

        var {coupon, formOpen, wrongCode} = this.state;

        if (!coupon) {
            return null;
        }

        console.log(this.state.coupon);

        var data = coupon.offer;

        return (
            <div className="Coupon">
                <div>
                    <img src={data.imageUrl}/>
                    <h1>{data.title}</h1>
                    <p>{data.description}</p>
                    <p>בתוקף עד: {moment(data.endingDate).format('DD/MM/YYYY')}</p>
                </div>
                {}
                <div>

                </div>
                <div className="Coupon-realization">
                    {formOpen ?
                        <form>
                            <TextField name="clientName" onChange={this.onChange} hintText="שם"/>
                            <TextField name="clientEmail" onChange={this.onChange} hintText="כתובת מייל"/>
                            <TextField name="offerCode" onChange={this.checkCode} hintText="קוד קופון"/>
                            {wrongCode && <p>הקוד שגוי</p> }
                            <div className="form-button">
                                <RaisedButton secondary onClick={this.realizeCoupon}>ממש</RaisedButton>
                            </div>
                        </form>
                        :
                        <RaisedButton primary onClick={this.openForm}>ממש</RaisedButton>

                    }
                </div>

            </div>
        );


    }


}

export default ClientOfferPreview;
