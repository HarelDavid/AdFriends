import React from 'react';
import {observer} from 'mobx-react';
import {observable, expr} from 'mobx';
import CSSModules from 'react-css-modules'
import autobind from 'autobind-decorator'
import cn from 'classnames';

import style from './style.scss';
Object.assign(style)


@observer
class Offer extends React.Component {

   @observable
    state = {
		offer : {},
        itemBeingEdited: false

    }

    componentWillMount(){
		const {offer} = this.props;
		this.state.offer = offer;
	}

	updateProperty (key, value) {
		var  {offer} = this.state;
		offer[key] = value;
	}

	@autobind
	onChange (event) {
		this.updateProperty(event.target.name, event.target.value)
	}


	@autobind
	handleSubmit() {
		var  {offer} = this.state;
		if (offer) {
			offer.save();
		}
	};

	@autobind
	handleDestroy() {
		var  {offer} = this.state;
		if (offer) {
			offer.remove();
		}
	};

	@autobind
	handleEdit()  {
		 this.state.itemBeingEdited = true;
	};


	render() {
        const {offer} = this.state;


        return (
            <li className={this.state.itemBeingEdited ? style.item + " edit" : style.item}>
                <div className={style.preview}>
                    <div className={style.cell}>
                        {offer.title}
                    </div>
                    <div className={cn(style.cell, style.button_cell)}>
					{!this.state.itemBeingEdited ? <button className="button edit" onClick={this.handleEdit}>edit</button>:
                    <button className="button save" onClick={this.handleSubmit}>save</button>}

                    </div>
                </div>
                {this.state.itemBeingEdited ?
                    <div className={style.edit_form}>
                        <div className={style.cell}>
                            <label>Title</label>
							<input type="text" name="title" value={offer.title} onChange={this.onChange}/>
                        </div>
                        <div className={style.cell}>
                            <label>Description</label>
							<input type="text" name="description" value={offer.description} onChange={this.onChange}/>
                        </div>
                        <div className={style.cell}>
                            <label>Message to Client:</label>
							<input type="text" name="preMessage" value={offer.preMessage} onChange={this.onChange}/>
                        </div>
                        <div className={style.cell}>
                            <label>Terms</label>
							<input type="text" name="terms" value={offer.terms} onChange={this.onChange}/>
                        </div>
                        <div className={style.cell}>
                            <label>Friend Gift</label>
							<input type="text" name="offerGift" value={offer.offerGift} onChange={this.onChange}/>
                        </div>
                        <div className={style.cell}>
                            <label>Client Gift</label>
							<input type="text" name="clientGift" value={offer.clientGift} onChange={this.onChange}/>
                        </div>
                        <div className={style.cell}>
                            <label>Date created</label>
							<input type="date" name="dateCreated" value={offer.dateCreated} disabled />
                        </div>
                        <div className={style.cell}>
                            <label>Ending Date</label>
							<input type="date" name="endingDate" value={offer.endingDate} onChange={this.onChange}/>
                        </div>
                        <div className={style.cell}>
                            <label>Code</label>
							<input type="text" name="code" value={offer.code} onChange={this.onChange}/>

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



}

export default CSSModules(Offer, style);
