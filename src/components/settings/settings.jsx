import React from 'react';
import {observer} from 'mobx-react';
import {observable, expr} from 'mobx';
import autobind from 'autobind-decorator'
import classname from 'classnames';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';
import {pinkA200} from 'material-ui/styles/colors';
import ImageUploader from'react-firebase-image-uploader';
import * as firebase from 'firebase';

@observer
export default class Settings extends React.Component {


    @autobind
    onChange(event) {
        this.updateProperty(event.target.name, event.target.value)
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
                    <TextField name="clientName" onChange={this.onChange} hintText="שם בית העסק"/>
                    <TextField name="offerCode" onChange={this.onChange} hintText="כתובת"/>
                    <TextField name="offerCode" onChange={this.onChange} hintText="תיאור"/>

                    <ImageUploader
                        name="avatar"
                        storageRef={firebase.storage().ref('images')}
                        onUploadStart={this.handleUploadStart}
                        onUploadError={this.handleUploadError}
                        onUploadSuccess={this.handleUploadSuccess}
                        onProgress={this.handleProgress}
                    />

                    <Avatar style={{margin: '20px auto', display: 'block'}} size={100} backgroundColor={pinkA200}
                            src={businessStore.business.imageUrl}/>
                    </div>
                    <RaisedButton primary>שמור</RaisedButton>

                </Paper>

            </div>
        );


    }


}


