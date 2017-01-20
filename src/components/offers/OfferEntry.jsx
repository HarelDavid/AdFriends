import React from 'react';
import {observer} from 'mobx-react';
import autobind from 'autobind-decorator'
import ImageUploader from'react-firebase-image-uploader';
import * as firebase from 'firebase';
import OfferModel from '../../models/OfferModel'



const ENTER_KEY = 13;

@observer
export default class OfferEntry extends React.Component {

	state = {title: '', description:'', imageUrl: '' };

	@autobind
	handleTitleChange(event){
		this.setState({title: event.target.value});
	}

	@autobind
	handleDescriptionChange(event){
		this.setState({description: event.target.value});
	}

	@autobind
	handleNewOfferKeyDown(){

		var {title, description, imageUrl} = this.state;
		var offer = new OfferModel(title, description, imageUrl,this.props.offerStore);
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
	handleProgress(progress){
		this.setState({progress});
	}

	@autobind
	handleUploadError(error) {
		this.setState({isUploading: false});
		console.error(error);
	}

	@autobind
	handleUploadSuccess (filename) {
		this.setState({avatar: filename, progress: 100, isUploading: false});
		var imagesRef = firebase.storage().ref('images').child(filename);
		firebase.storage().ref('images').child(filename).getDownloadURL().then(url => this.setState({imageUrl: url}));
	};


	render() {
		if(!firebase.storage){
			return null;
		}

		return (
			<form className="form-inline">
				<label>
					<span className="input-name">Name:</span>
					<input type="text" value={this.state.title} onChange={this.handleTitleChange}   placeholder="offer title"/>

				</label>

				<label>
					<span className="input-name">description:</span>
					<textarea value={this.state.description} onChange={this.handleDescriptionChange} placeholder="offer description"/>
				</label>

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

				<div value="Submit" onClick={this.handleNewOfferKeyDown}>submit</div>


			</form>
		)
	}
}
