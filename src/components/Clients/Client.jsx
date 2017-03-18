import React from 'react';
import {observer} from 'mobx-react';
import {observable, expr} from 'mobx';
import autobind from 'autobind-decorator'
import classname from 'classnames';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

import style from './style.scss';


@observer

export default class Client extends React.Component {

    @observable
    state = {
        client: {},
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
    handleSubmit() {
        var {client} = this.state;
        if (client) {
            client.save();
        }
    };

    @autobind
    handleDestroy() {
        var {client} = this.state;
        if (client) {
            client.destroy();
        }
    };

    @autobind
    handleEdit() {
        this.state.itemBeingEdited = true;
    };


    render() {
        
        return (

            <TableRow>
                <TableRowColumn>1</TableRowColumn>
                <TableRowColumn>John Smith</TableRowColumn>
                <TableRowColumn>Employed</TableRowColumn>
            </TableRow>
        );
    }


}

