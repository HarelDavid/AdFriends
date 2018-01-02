import React from 'react';
import {observer} from 'mobx-react';
import {hashHistory} from 'react-router';
import {observable, expr} from 'mobx';
import autobind from 'autobind-decorator'
import classname from 'classnames';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import ImageEditor from '../imageEditor/image-editor';
import * as firebase from 'firebase';

@observer
export default class Settings extends React.Component {

    @observable
    state = {
        business: {}
    }

    componentWillMount() {
        var {businessStore} = this.props.route;
        this.state.business = businessStore.business;

    }

    @autobind
    onChange(event) {
        this.updateProperty(event.target.name, event.target.value)
    }

    updateProperty(key, value) {
        var {business} = this.state;
        business[key] = value;
    }

    @autobind
    save() {
        var {business} = this.state;
        if (business) {
            business.save()
            hashHistory.push('/offers');
        }

    };

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
        firebase.storage().ref('images').child(filename).getDownloadURL().then(url => this.updateProperty('imageUrl', url));
    };

    @autobind
	checkUrlPrefix(e) {
		let website = e.target.value.trim();
		let prefix = website.substr(0, 4);

		if (website && (prefix !== 'http')) {
		    debugger
			this.updateProperty(e.target.name, 'http://' + website)
		}
	}

    render() {

        var {businessStore} = this.props.route;

        if (!businessStore) {
            return null;
        }


        var business = businessStore.business;


        return (
            <div className="Settings">
                <h1>עדכון פרטים</h1>

                <Paper className="Settings-paper">
                    <div>
                        <form style={{display: 'flex', flexDirection: 'column'}}>
                            <TextField name="title" defaultValue={business.title} onChange={this.onChange} hintText="שם בית העסק"/>
                            <TextField name="address" defaultValue={business.address} onChange={this.onChange} hintText="כתובת"/>
                            <TextField name="description" defaultValue={business.description} multiLine={true} onChange={this.onChange} hintText="תיאור בית עסק"/>
                            {/*<TextField name="businessType" defaultValue={business.businessType} onChange={this.onChange} hintText="סוג בית עסק"/>*/}
                            <TextField name="phone" defaultValue={business.phone}  onChange={this.onChange} hintText="מספר טלפון"/>
                            <TextField name="website" defaultValue={business.website} onChange={this.onChange} onBlur={this.checkUrlPrefix} hintText="לינק (אתר, דף פייסבוק)"/>


                            {/*<ImageEditor src={business.imageUrl} onUpload={this.setImageSrc}  />*/}

                            {/*<ImageUploader*/}
                                {/*name="avatar"*/}
                                {/*storageRef={firebase.storage().ref('images')}*/}
                                {/*onUploadStart={this.handleUploadStart}*/}
                                {/*onUploadError={this.handleUploadError}*/}
                                {/*onUploadSuccess={this.handleUploadSuccess}*/}
                                {/*onProgress={this.handleProgress}*/}
                            {/*/>*/}

                            {/*<Avatar style={{margin: '20px auto', display: 'block'}} size={100}*/}
                                    {/*backgroundColor={pinkA200}*/}
                                    {/*src={business.imageUrl}/>*/}
                        </form>

                    </div>
                    <RaisedButton primary onClick={this.save}>שמור</RaisedButton>

                </Paper>

            </div>
        );


    }


}


