import React from 'react';
import {observer} from 'mobx-react';
import {observable, action} from 'mobx';
import autobind from 'autobind-decorator'
import PropTypes from 'prop-types';
import AvatarEditor from 'react-avatar-editor'
import Slider from '../slider'
import FontIcon from 'material-ui/FontIcon'
import {convertToImage, dataURItoFile} from '../../utils';
import * as firebase from 'firebase';
import RaisedButton from 'material-ui/RaisedButton'
import RefreshIndicator from 'material-ui/RefreshIndicator';
import './style.scss';


@observer
class ImageEditor extends React.Component {

	static PropTypes = {
		src: PropTypes.string,
		onUpload: PropTypes.func
	}

	@observable state = {
		// scale: 1,
		// degrees: 0,
		src: '',
		filename: '',
		loading: false
	}

	componentWillMount() {
		this.state.src = this.props.src;
	}


	// @autobind
	// @action
	// zoom(value) {
	// 	this.state.scale = value * 2 * 0.01;
	// }
	//
	//
	// @autobind
	// @action
	// rotate() {
	// 	this.state.degrees = (this.state.degrees + 90) % 360;
	// }


	@autobind
	handleBeforeUpload(e) {
		e.persist();
		this.state.loading = true;

		let file = e.target.files[0],
			reader = new FileReader();

		if (!file.type.match('image.*')) {
			alert('Please upload an image');
		}

		this.state.filename = file.name;

		return convertToImage(file)
			.then(image => {
				this.state.src = image.src;
			})
			.then(() => {
				setTimeout(() => {
					this.uploadImage();
					this.state.loading = true;
					console.log('Uploaded successfully')
				}, 500)
			})

	};


	saveThumbnail(file) {
		// this.setState({avatar: filename, progress: 100, isUploading: false});
		var storageRef = firebase.storage().ref('images').child(file.name);

		storageRef.child(file.name).put(file).then((snapshot) => {
			return this.props.onUpload(snapshot.downloadURL);
		})

	}

	uploadImage() {
		var canvas = this.editor.getImageScaledToCanvas(),
			data = canvas.toDataURL(),
			resultFile = dataURItoFile(data, this.state.filename);

		console.log(resultFile);
		this.saveThumbnail(resultFile);
	}


	render() {
		let {scale} = this.state;

		return (
			<div className="ImageEditor">
				<div className="ImageEditor-upload">
					<input type="file" onChange={this.handleBeforeUpload}/>
				</div>
				<AvatarEditor ref={(ref) => this.editor = ref}
							  image={this.state.src}
							  width={360}
							  height={250}
							  border={0}
							  color={[255, 255, 255, 0.6]}
							  scale={scale}/>
				{this.state.loading && <RefreshIndicator
					size={40}
					left={10}
					top={0}
					status="loading"

				/> }
				{/*<p>הקטן/הגדל את התמונה:</p>*/}
				{/*<Slider center initPercentPosition={50} onChange={this.zoom}/>*/}

				<div className="ImageEditor-actions">

					{/*<RaisedButton secondary onTouchTap={()=>this.uploadImage()}><span style={{color: '#fff'}}>שמור תמונה</span></RaisedButton>*/}
				</div>


			</div>
		);


	}


}

export default ImageEditor;


