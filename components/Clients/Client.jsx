import React from 'react';
import {observer} from 'mobx-react';
import {observable, expr} from 'mobx';
import CSSModules from 'react-css-modules'
import autobind from 'autobind-decorator'
import classname from 'classnames';

import style from './style.scss';
Object.assign(style)


@observer
class Client extends React.Component {

    @observable
    state = {
        client : {},
        itemBeingEdited: false

    }

    componentWillMount(){
        const {client} = this.props;
        this.state.client = client;
    }

    updateProperty (key, value) {
        var  {client} = this.state;
        client[key] = value;
    }

    @autobind
    onChange (event) {
        this.updateProperty(event.target.name, event.target.value)
    }


    @autobind
    handleSubmit() {
        var  {client} = this.state;
        if (client) {
            client.save();
        }
    };

    @autobind
    handleDestroy() {
        var  {client} = this.state;
        if (client) {
            client.remove();
        }
    };

    @autobind
    handleEdit()  {
        this.state.itemBeingEdited = true;
    };


    render() {
        const {client,itemBeingEdited} = this.state;


        return (
            <li className={itemBeingEdited ? style.item + " edit" : style.item}>
                <div className={style.preview}>
                    <div className={style.cell}>
                        <input type="text" name="title" disabled={!itemBeingEdited} value={client.title} onChange={this.onChange}/>
                    </div>
                </div>
                <div className={classname(style.cell, style.button_cell)}>
                    {!this.state.itemBeingEdited ? <button className="button edit" onClick={this.handleEdit}>edit</button>:
                        <button className="button save" onClick={this.handleSubmit}>save</button>}

                </div>
            </li>
        );
    }



}

export default CSSModules(Client, style);
