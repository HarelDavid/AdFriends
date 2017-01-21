import React from 'react';
import CSSModules from 'react-css-modules'
import {observer} from 'mobx-react';
import autobind from 'autobind-decorator'
import ImageUploader from'react-firebase-image-uploader';
import * as firebase from 'firebase';
import ClientModel from '../../models/ClientModel'
import {observable} from 'mobx';

import style from './style.scss';
Object.assign(style)

const ENTER_KEY = 13;

@observer
class ClientEntry extends React.Component {

    @observable
    state = {
        client : new ClientModel({store:this.props.clientStore}),
        itemBeingEdited: false

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
    };

    @autobind
    handleNewClientKeyDown() {

        var {client} = this.state;
        client.save();
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
        var {client} = this.state;

        if (!firebase.storage) {
            return null;
        }

        return (
            <form className="addItemForm">
                <div className={style.cell}>
                    <label>Title</label>
                    <input type="text" name="title" value={client.title} onChange={this.onChange}/>
                </div>
                <div className={style.cell}>
                    <label>Description</label>
                    <textarea name="description" value={client.description} onChange={this.onChange}/>
                </div>
                <div className={style.cell}>
                    <label>Message to Client:</label>
                    <textarea type="text" name="preMessage" value={client.preMessage} onChange={this.onChange}/>
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


                <div className="button save" onClick={this.handleNewClientKeyDown}>submit</div>


            </form>
        )
    }
}

export default CSSModules(ClientEntry, style);
