import React from 'react';
import {observer} from 'mobx-react';
import {observable, expr} from 'mobx';
import ViewStore from '../../stores/viewStore';
import CSSModules from 'react-css-modules'
import cn from 'classnames';

import style from './style.scss';
Object.assign(style)

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;


@observer
class Offer extends React.Component {
    @observable
    editText = "";
    viewStore;

    @observable
    state = {
        itemBeingEdited: false
    }

    componentWillMount() {

        this.viewStore = new ViewStore();
    }

    render() {
        const {offer} = this.props;

        const viewStore = this.viewStore;
        return (
            <li className={this.state.itemBeingEdited ? style.item + " edit" : style.item}>
                <div className={style.preview}>
                    <div className={style.cell}>
                        {offer.title}
                    </div>
                    <div className={cn(style.cell, style.button_cell)}>
                    <button className="button edit" onClick={this.handleEdit.bind(this)}>{this.state.itemBeingEdited ? 'save' : 'edit'}</button>
                    {/*<button*/}
                        {/*ref="editField"*/}
                        {/*className="button edit"*/}
                        {/*value={this.editText}*/}
                        {/*onBlur={this.handleSubmit}*/}
                        {/*onChange={this.handleChange}*/}
                        {/*onKeyDown={this.handleKeyDown}*/}
                    {/*>edit*/}
                    {/*</button>*/}
                    </div>
                </div>
                {this.state.itemBeingEdited ?
                    <div className={style.edit_form}>
                        <div className={style.cell}>
                            <label>Title</label>
                            <input type="text" defaultValue={offer.title}/>
                        </div>
                        <div className={style.cell}>
                            <label>Description</label>
                            <input type="text" defaultValue={offer.description}/>
                        </div>
                        <div className={style.cell}>
                            <label>Message to Client:</label>
                            <input type="text" defaultValue={offer.pre_message}/>
                        </div>
                        <div className={style.cell}>
                            <label>Terms</label>
                            <input type="text" defaultValue={offer.terms}/>
                        </div>
                        <div className={style.cell}>
                            <label>Friend Gift</label>
                            <input type="text" defaultValue={offer.offer_gift}/>
                        </div>
                        <div className={style.cell}>
                            <label>Client Gift</label>
                            <input type="text" defaultValue={offer.client_gift}/>
                        </div>
                        <div className={style.cell}>
                            <label>Date created</label>
                            <input type="date" defaultValue={offer.date_created} disabled/>
                        </div>
                        <div className={style.cell}>
                            <label>Ending Date</label>
                            <input type="date" defaultValue={offer.ending_date}/>
                        </div>
                        <div className={style.cell}>
                            <label>Code</label>
                            <input type="text" defaultValue={offer.code}/>
                        </div>
                        <div className={style.urls}>
                            {offer.urls && offer.urls.map((url) =>
                                <div>{url}</div>
                            )}
                        </div>

                        <div className={cn(style.cell, style.image_cell)}>
                            <img src={offer.imageUrl}/>
                        </div>
                    </div> : null }

            </li>
        );
    }

    handleSubmit = (event) => {
        const val = this.editText.trim();
        if (val) {
            this.props.offer.setTitle(val);
            this.editText = val;
        }
        this.state.itemBeingEdited = null;
    };

    handleDestroy = () => {
        this.props.offer.destroy();
        this.props.viewStore.itemBeingEdited = null;
    };


    handleEdit = () => {
        !this.state.itemBeingEdited ? this.state.itemBeingEdited = true : this.handleSubmit();
    };

    handleKeyDown = (event) => {
        if (event.which === ESCAPE_KEY) {
            this.editText = this.props.offer.title;
            this.props.viewStore.itemBeingEdited = null;
        } else if (event.which === ENTER_KEY) {
            this.handleSubmit(event);
        }
    };

    handleChange = (event) => {
        this.editText = event.target.value;
    };

    handleToggle = () => {
        this.props.offer.toggle();
    };

}

export default CSSModules(Offer, style);
