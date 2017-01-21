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
        const {client} = this.state;


        return (
            <li className={this.state.itemBeingEdited ? style.item + " edit" : style.item}>
                <div className={style.preview}>
                    <div className={style.cell}>
                        {client.title}
                    </div>
                    <div className={classname(style.cell, style.button_cell)}>
                        {!this.state.itemBeingEdited ? <button className="button edit" onClick={this.handleEdit}>edit</button>:
                            <button className="button save" onClick={this.handleSubmit}>save</button>}

                    </div>
                </div>
                {this.state.itemBeingEdited ?
                    <div className={style.edit_form}>
                        <div className={style.cell}>
                            <label>Name</label>
                            <input type="text" name="name" value={client.name} onChange={this.onChange}/>
                        </div>
                        {/*<div className={style.cell}>*/}
                            {/*<label>Date created</label>*/}
                            {/*<input type="date" name="dateCreated" value={client.dateCreated} disabled />*/}
                        {/*</div>*/}
                        <div className={style.urls}>
                            {client.offers && client.offers.map((url) =>
                                <div>{url}</div>
                            )}
                        </div>

                    </div> : null }

            </li>
        );
    }



}

export default CSSModules(Client, style);
