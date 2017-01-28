import React from 'react';
import CSSModules from 'react-css-modules'
import {observer} from 'mobx-react';
import autobind from 'autobind-decorator'
import ImageUploader from'react-firebase-image-uploader';
import * as firebase from 'firebase';
import OfferModel from '../../models/OfferModel'
import {observable} from 'mobx';

import style from './style.scss';
Object.assign(style)

const ENTER_KEY = 13;

@observer
class OfferEntry extends React.Component {

    @observable
    state = {
        offer : {},
        itemBeingEdited: false

    }

    componentDidMount(){
        console.log(this.props);
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
    handleNewOfferKeyDown(e) {
        e.preventDefault();
        var {offer} = this.state;
        var offer = new OfferModel({offer});
        offer.save();
        this.clearForm();

    };

    clearForm() {
        this.setState({description: ""});
        this.setState({title: ""});
    }


    @autobind
    handleUploadStart() {
        this.setState({isUploading: true, progress: 0});
    }

    @autobind
    handleProgress(progress) {
        this.setState({progress});
    }

    @autobind
    handleUploadError(error) {
        this.setState({isUploading: false});
        console.error(error);
    }

    @autobind
    handleUploadSuccess(filename) {
        this.setState({avatar: filename, progress: 100, isUploading: false});
        var imagesRef = firebase.storage().ref('images').child(filename);
        firebase.storage().ref('images').child(filename).getDownloadURL().then(url => this.setState({imageUrl: url}));
    };


    render() {
        var {offer} = this.state;

        if (!firebase.storage) {
            return null;
        }

        return (
            <form className="addItemForm">
                <div className={style.cell}>
                    <label>Title</label>
                    <input type="text" name="title" value={offer.title} onChange={this.onChange}/>
                </div>
                <div className={style.cell}>
                    <label>Description</label>
                    <textarea name="description" value={offer.description} onChange={this.onChange}/>
                </div>
                <div className={style.cell}>
                    <label>Message to Client:</label>
                    <textarea type="text" name="preMessage" value={offer.preMessage} onChange={this.onChange}/>
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

                <label>
                    <ImageUploader
                        name="avatar"
                        storageRef={firebase.storage().ref('images')}
                        onUploadStart={this.handleUploadStart}
                        onUploadError={this.handleUploadError}
                        onUploadSuccess={this.handleUploadSuccess}
                        onProgress={this.handleProgress}
                    />
                </label>


                <button className="button save" onClick={(e) => this.handleNewOfferKeyDown(e)}>submit</button>


            </form>
        )
    }
}

export default CSSModules(OfferEntry, style);
