import React from 'react';
import {observer} from 'mobx-react';
import {observable, expr} from 'mobx';
import autobind from 'autobind-decorator'
import classname from 'classnames';
import {Link} from 'react-router';
import CouponModel from '../../models/CouponModel'
import { Creatable } from 'react-select';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import moment from 'moment';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import ClientModel from '../../models/ClientModel'

import './style.scss';



@observer
export default class Offer extends React.Component {

    @observable
    state = {
        offer: {},
        expended: false,
        chosenClient: {},
        link:"",
		client: new ClientModel({store: this.props.clientStore}),
	}

    componentWillMount() {
        const {offer, couponsStore} = this.props;
        this.state.offer = offer;
        this.clientStore = this.props.businessStore.clientStore;


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
        if(clientOption && clientOption.className) {
            this.handleNewClient(clientOption);
        }
        this.state.chosenClient = this.clientStore.clients.find((it) => it.id == clientOption.value)
    }

    @autobind
    handleToggle(event, toggle) {
        this.setState({expanded: toggle});
    };

    @autobind
	handleNewClient(){
		var {client} = this.state;

		if (client.label !== "") {
			client.save();
		}
    }


    render() {
        const {offer} = this.state;
        const {businessStore, couponsStore} = this.props;


        return (

        <Card style={{margin: '20px 0'}}>
            <CardHeader
                title={offer.title}
                actAsExpander={true}
                showExpandableButton={true}
                closeIcon={<FontIcon className="material-icons" style={{color: '#189d0e'}}>share</FontIcon>}
                openIcon={<FontIcon className="material-icons">expand_less</FontIcon>}
            />
            <CardActions style={{display: 'flex', justifyContent: 'flex-end'}}>
                <Link to={`/offer/${offer.id}`}>
                    <IconButton><FontIcon className="material-icons" >mode_edit</FontIcon></IconButton>
                </Link>
                {/*<IconButton actAsExpander></IconButton>*/}
            </CardActions>
            <CardText expandable={true}>
                <div className="shareDialog">
                    <Creatable
                        name="form-field-name"
                        value={this.state.chosenClient.id}
                        options={this.getClientOption()}
                        onChange={this.handleClientChoose}
                        />

                    <RaisedButton secondary onClick={this.createLink}>צור קופון</RaisedButton>

                    {this.state.link && <Link to={this.state.link}><RaisedButton secondary>תצוגה מקדימה</RaisedButton></Link>}
                </div>
            </CardText>
        </Card>

        );
    }


}


