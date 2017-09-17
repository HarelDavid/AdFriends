import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules'
import {observer} from 'mobx-react';
import {hashHistory} from 'react-router';
import Promise from "bluebird";
import autobind from 'autobind-decorator'
import ImageUploader from 'react-firebase-image-uploader';
import * as firebase from 'firebase';
import OfferModel from '../../models/OfferModel'
import {observable, computed, action, extendObservable, toJS, autorun} from 'mobx';
import ReactTooltip from 'react-tooltip';
import moment from 'moment';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import Paper from 'material-ui/Paper';


import style from './style.scss';
Object.assign(style)

var tooltip = require('json!./info.json');

const ENTER_KEY = 13;

@observer
class OfferEntry extends React.Component {

    @observable
    state = {
        offer: {}
    }

    static PropTypes = {
        offer: PropTypes.object
    }

    componentWillMount() {

        var {offerStore} = this.props.route.businessStore;
        const offerId = this.props.params.offerId;


        if (offerId) {
            var offer = offerStore.offers.find((it) => it.id == offerId);
            this.state.offer = offer;

		} else {
            this.state.offer = new OfferModel({store: this.props.route.businessStore.offerStore});
        }

        console.log(this.state.offer)
    }

    componentDidMount(){
		this.state.offer.imageUrl && this.drawImage(this.state.offer.imageUrl);
    }


    shouldComponentUpdate(nextProps, nextState) {

        if (this.state.offer !== nextState.offer) {
            return true;
        }
        return false;
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
    onChangeDate(event, date) {
        this.updateProperty('endingDate', date)
    }



    @autobind
    handleNewOfferKeyDown(e) {
        e.preventDefault();
		this.state.offer.save();
        hashHistory.push('/offers');
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

    drawImage(url){
		var canvas = document.getElementById('canvas'),
		ctx = canvas.getContext('2d'),
		img = new Image();
		img.src = url;
		img.onload = function(){
		    var ratio = img.width/canvas.width;
			ctx.drawImage(img, 0, 0, img.width,    img.height,
				0, 0, canvas.width, img.height/ratio);
		}
    }

    @autobind
    handleUploadSuccess(e) {
        var {offer} = this.state;

		e.persist();
		let file = e.target.files[0];

		if(!file.type.match('image.*')){
		    alert('Please upload an image')
        }

		return this.convertToImage(file)
			.then(image => {
			    this.state.offer.imageUrl = image.src;
				this.drawImage(image.src);
			})

	};

    convertToImage(file) {
	return new Promise((resolve, reject) => {
		var reader = new FileReader();
		reader.readAsDataURL(file);

		reader.addEventListener("load", (ev) => {
			var img = new Image();
			img.src = ev.target.result;

			img.addEventListener("load", () => {
				resolve(img);
			});

		});

		reader.addEventListener("error", () => {
			reject(reader.error);
		});
	})
}

	@autobind
    goBack() {
        hashHistory.push('/offers');
    }

    @autobind
	formatDate(date){
        return moment(date).format('DD/MM/YY')
	}

    render() {
        var {offer} = this.state;
        var offerProps = this.props.offer;
        var {route} = this.props;
        if (!firebase.storage || !route.businessStore.isInitialized) {
            return null;
        }

        return (
            <div>

                <Paper style={{marginTop: 20}}>
                    <form className="addItemForm">

                        <div className="row">
                            <label>שם המבצע <span data-tip={tooltip.title} data-for='title'>?</span></label>
                            <TextField name="title" defaultValue={offer.title} onChange={this.onChange}/>
                            <ReactTooltip id="title"/>
                        </div>
                        <div className="row">
                            <label>תיאור <span data-tip={tooltip.desc} data-for='desc'>?</span></label>
                            <TextField multiLine name="description" defaultValue={offer.description}
                                       onChange={this.onChange}/>
                            <ReactTooltip id="desc"/>

                        </div>
                        <div className="row">
                            <label>הודעה ללקוח<span data-tip={tooltip.message}
                                                           data-for='message'>?</span></label>
                            <TextField multiLine name="preMessage" value={offer.preMessage}
                                       onChange={this.onChange}/>
                            <ReactTooltip id="message"/>
                        </div>
                        <div className="row">
                            <label>תנאים<span data-tip={tooltip.terms} data-for='terms'>?</span></label>
                            <TextField name="terms" multiLine value={offer.terms} onChange={this.onChange}/>
                            <ReactTooltip id="terms"/>
                        </div>
                        {/*<div className="row">*/}
                            {/*<label>Friend Gift<span data-tip={tooltip.giftFriend} data-for='giftFriend'>?</span></label>*/}
                            {/*<TextField name="offerGift" value={offer.offerGift} onChange={this.onChange}/>*/}
                            {/*<ReactTooltip id="giftFriend"/>*/}
                        {/*</div>*/}
                        {/*<div className="row">*/}
                            {/*<label>Client Gift<span data-tip={tooltip.giftClient} data-for='giftClient'>?</span></label>*/}
                            {/*<TextField name="clientGift" value={offer.clientGift} onChange={this.onChange}/>*/}
                            {/*<ReactTooltip id="giftClient"/>*/}

                        {/*</div>*/}
                        <div className="row">
                            <label>בתוקף עד<span data-tip={tooltip.endDate} data-for='endDate'>?</span></label>
                            <DatePicker autoOk name="endingDate" value={offer.endingDate} onChange={this.onChangeDate} formatDate={this.formatDate}/>
                            <ReactTooltip id="endDate"/>
                        </div>
                        {/*<div className="row">*/}
                            {/*<label>Code<span data-tip={tooltip.code} data-for='code'>?</span></label>*/}
                            {/*<TextField name="code" value={offer.code} onChange={this.onChange}/>*/}
                            {/*<ReactTooltip id="code"/>*/}

                        {/*</div>*/}

                        <label>
                            {/*<ImageUploader*/}
                                {/*name="avatar"*/}
                                {/*storageRef={firebase.storage().ref('images')}*/}
                                {/*onUploadStart={this.handleUploadStart}*/}
                                {/*onUploadError={this.handleUploadError}*/}
                                {/*onUploadSuccess={this.handleUploadSuccess}*/}
                                {/*onProgress={this.handleProgress}*/}
                            {/*/>*/}
                            <input type="file" onChange={this.handleUploadSuccess} />
                        </label>


                        <canvas id="canvas" style={{
							width: '100%',
							height: '250px'
						}}/>


                        <RaisedButton secondary={true} style={{color: 'white', margin: '10px 0'}}
                                      onTouchTap={(e) => this.handleNewOfferKeyDown(e)}>שמור</RaisedButton>


                    </form>
                </Paper>
            </div>
        )
    }
}

export default CSSModules(OfferEntry, style);


