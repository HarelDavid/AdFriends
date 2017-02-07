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
        this.state.itemBeingEdited = false;
    };

    @autobind
    handleDestroy() {
        var  {client} = this.state;
        if (client) {
            client.destroy();
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
						<button className="button save" onClick={this.handleDestroy}>delete</button>

                    </div>
                </div>
                {this.state.itemBeingEdited ?
                    <div className={style.edit_form}>
                        <div className={style.cell}>
                            <label>Title</label>
                            <input type="text" name="title" value={client.title} onChange={this.onChange}/>
                        </div>
                        <div className={style.cell}>
                            <label>Description</label>
                            <input type="text" name="description" value={client.description} onChange={this.onChange}/>
                        </div>
                        <div className={style.cell}>
                            <label>Message to Client:</label>
                            <input type="text" name="preMessage" value={client.preMessage} onChange={this.onChange}/>
                        </div>
                        <div className={style.cell}>
                            <label>Terms</label>
                            <input type="text" name="terms" value={client.terms} onChange={this.onChange}/>
                        </div>
                        <div className={style.cell}>
                            <label>Friend Gift</label>
                            <input type="text" name="clientGift" value={client.clientGift} onChange={this.onChange}/>
                        </div>
                        <div className={style.cell}>
                            <label>Client Gift</label>
                            <input type="text" name="clientGift" value={client.clientGift} onChange={this.onChange}/>
                        </div>
                        <div className={style.cell}>
                            <label>Date created</label>
                            <input type="date" name="dateCreated" value={client.dateCreated} disabled />
                        </div>
                        <div className={style.cell}>
                            <label>Ending Date</label>
                            <input type="date" name="endingDate" value={client.endingDate} onChange={this.onChange}/>
                        </div>
                        <div className={style.cell}>
                            <label>Code</label>
                            <input type="text" name="code" value={client.code} onChange={this.onChange}/>

                        </div>
                        <div className={style.urls}>
                            {client.urls && client.urls.map((url) =>
                                <div>{url}</div>
                            )}
                        </div>

                        <div className={classname(style.cell, style.image_cell)}>
                            <img src={client.imageUrl}/>
                        </div>
                    </div> : null }

            </li>
        );
    }



}

export default CSSModules(Client, style);
