import React from 'react';
import {observer} from 'mobx-react';
import {observable, action} from 'mobx';
import autobind from 'autobind-decorator'
import classname from 'classnames';
import AvatarEditor from 'react-avatar-editor'
import Slider from '../slider'

import './style.scss';


@observer
class ImageEditor extends React.Component {

	@observable state = {
		scale: 1,
		degrees: 0,
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
	@action
	zoom(value) {
		this.state.scale = value * 2 * 0.01;
	}


	@autobind
	@action
	rotate() {
		this.state.degrees = (this.state.degrees + 90) % 360;
	}


	@autobind
	handleUploadSuccess(e) {

		e.persist();
		let file = e.target.files[0],
			{canvas} = this.state;

		if (!file.type.match('image.*')) {
			alert('Please upload an image')
		}


		return this.convertToImage(file)
			.then(image => {
				this.state.offer.imageUrl = image.src;
			}).finally(() => {
				setTimeout(() => {
					// this.state.offer.imageUrl = canvas.toDataURL('image/jpeg');
					this.state.uploading = false;
					// this.saveThumbnail(file);
				}, 500)

			})
	};


	saveThumbnail(file) {
		// this.setState({avatar: filename, progress: 100, isUploading: false});
		var storageRef = firebase.storage().ref('images').child(file.name);

		storageRef.child(file.name).put(file).then((snapshot) => {
			console.log(snapshot.downloadURL);
			this.state.offer.thumbnail = snapshot.downloadURL
		})


		// firebase.storage().ref('images').child(file.name).getDownloadURL().then(url =>
		// 	this.state.offer.thumbnail = url
		// );

	}

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


	render() {
		let {scale,degrees} = this.state;

		return (
			<div className="ImageEditor">
				<AvatarEditor
					image={this.props.src}
					width={300}
					height={250}
					border={0}
					color={[255, 255, 255, 0.6]} // RGBA
					scale={scale}
					rotate={degrees}
				/>
				<input type="file" onChange={this.handleUploadSuccess}/>
				<Slider center initPercentPosition={50} onChange={this.zoom}/>
			</div>
		);


	}


}

export default ImageEditor;
