import React from 'react';
import {observer} from 'mobx-react';
import {observable, expr} from 'mobx';
import autobind from 'autobind-decorator'
import classname from 'classnames';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

import './style.scss';


@observer

export default class Client extends React.Component {

    @observable
    state = {
        itemBeingEdited: false

    }

    componentWillMount() {
        const {client} = this.props;
        this.state.client = client;
    }

    updateProperty(key, value) {
        var {client} = this.state;
        client[key] = value;
    }

    @autobind
    onChange(event) {
        this.updateProperty(event.target.name, event.target.value)
    }

    @autobind
	handleClientDelete(client){
		this.props.clientStore.remove(client);
    }

    render() {
        var {client, index} = this.props;
        return (

            <Card>
                <CardHeader
                    title={client.title}
                    actAsExpander={true}
                    showExpandableButton={true}
                />

                <CardText expandable={true}>
                    {client.couponLinks.length > 0 && client.couponLinks.map((coupon) => {
                       return <div key={coupon.id}><a href={coupon + '/preview'}>הצעה</a></div>
                    })
                    }
                </CardText>
            </Card>


        );
    }


}

