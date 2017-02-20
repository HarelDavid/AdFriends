import React, {PropTypes} from 'react';
import CSSModules from 'react-css-modules'
import {observer} from 'mobx-react';
import autobind from 'autobind-decorator'
import ImageUploader from'react-firebase-image-uploader';
import * as firebase from 'firebase';
import OfferModel from '../../models/OfferModel'
import {observable} from 'mobx';
import ReactTooltip from 'react-tooltip';
import style from './style.scss';
Object.assign(style)

var tooltip = require('json!./info.json');

const ENTER_KEY = 13;

@observer
class OfferEntry extends React.Component {

    @observable
    state = {
        offer: {},
        itemBeingEdited: false
    }

    static PropTypes = {
        offer: PropTypes.object
    }

    componentWillMount() {
        if (this.props.offer) {
            this.state.offer = this.props.offer;
            console.log(this.props.offerStore);

        } else {
            this.state.offer = new OfferModel({store: this.props.offerStore});
        }

        console.log(tooltip);
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
    }
    ;

    @autobind
    handleNewOfferKeyDown(e) {
        e.preventDefault();
        var {offer} = this.state;
        var {onSave} = this.props;

        offer.save();
        onSave();
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
                <div className={style.row}>
                    <label>Title <span data-tip={tooltip.title} data-for='title'>?</span></label>
                    <input type="text" name="title" value={offer.title} onChange={this.onChange}/>
                    <ReactTooltip id="title" />
                </div>
                <div className={style.row}>
                    <label>Description <span data-tip={tooltip.desc} data-for='desc'>?</span></label>
                    <textarea name="description" value={offer.description} onChange={this.onChange}/>
                    <ReactTooltip id="desc" />

                </div>
                <div className={style.row}>
                    <label>Message to Client:<span data-tip={tooltip.message} data-for='message'>?</span></label>
                    <textarea type="text" name="preMessage" value={offer.preMessage} onChange={this.onChange}/>
                    <ReactTooltip id="message"/>
                </div>
                <div className={style.row}>
                    <label>Terms<span data-tip={tooltip.terms} data-for='terms'>?</span></label>
                    <input type="text" name="terms" value={offer.terms} onChange={this.onChange}/>
                    <ReactTooltip id="terms"/>
                </div>
                <div className={style.row}>
                    <label>Friend Gift<span data-tip={tooltip.giftFriend} data-for='giftFriend'>?</span></label>
                    <input type="text" name="offerGift" value={offer.offerGift} onChange={this.onChange}/>
                    <ReactTooltip id="giftFriend"/>
                </div>
                <div className={style.row}>
                    <label>Client Gift<span data-tip={tooltip.giftClient} data-for='giftClient'>?</span></label>
                    <input type="text" name="clientGift" value={offer.clientGift} onChange={this.onChange}/>
                    <ReactTooltip id="giftClient"/>

                </div>
                <div className={style.row}>
                    <label>Ending Date<span data-tip={tooltip.endDate} data-for='endDate'>?</span></label>
                    <input type="date" name="endingDate" value={offer.endingDate} onChange={this.onChange}/>
                    <ReactTooltip id="endDate"/>
                </div>
                <div className={style.row}>
                    <label>Code<span data-tip={tooltip.code} data-for='code'>?</span></label>
                    <input type="text" name="code" value={offer.code} onChange={this.onChange}/>
                    <ReactTooltip id="code"/>

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


