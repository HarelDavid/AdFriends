import React from 'react';
import CSSModules from 'react-css-modules'
import {observer} from 'mobx-react';
import autobind from 'autobind-decorator'
import ImageUploader from'react-firebase-image-uploader';
import * as firebase from 'firebase';
import ClientModel from '../../models/ClientModel'
import {observable} from 'mobx';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import style from './style.scss';

const ENTER_KEY = 13;

@observer
export default class ClientEntry extends React.Component {

    @observable
    state = {
        client: new ClientModel({store: this.props.clientStore}),
        error: false

    }

    updateProperty(key, value) {
        var {client} = this.state;
        client[key] = value;
    }

    @autobind
    onChange(event) {
        this.updateProperty(event.target.name, event.target.value)
    }


    @autobind
    handleNewClientKeyDown(e) {
        var {client} = this.state;

        e.preventDefault();
        if (client.name !== "") {
            client.save();
        } else {
            this.state.error = true;
        }
        this.clearForm();

    };

    clearForm() {
        this.setState({client: {name: ""}});
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
        var {client,error} = this.state;

        if (!firebase.storage) {
            return null;
        }

        return (
            <form className="Client-addItemForm">
                <div className={error ? "cell error" : "cell"}>

                    <TextField placeholder="לקוח חדש" name="title" value={client.title} onChange={this.onChange}/>

                    <RaisedButton primary onClick={this.handleNewClientKeyDown}>שמור</RaisedButton>

                </div>

            </form>
        )
    }
}


