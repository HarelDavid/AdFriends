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
    handleNewClientKeyDown() {

        var {client} = this.state;
        var {onSave} = this.props;
        client.save();
        onSave();
        this.clearForm();

    };

    clearForm() {
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
                    <label>Name</label>
                    <input type="text" name="title" value={client.title} onChange={this.onChange}/>
                    <div className="button save" onClick={this.handleNewClientKeyDown}>Add Client</div>

                </div>

            </form>
        )
    }
}

export default CSSModules(ClientEntry, style);
