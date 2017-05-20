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
            business.save();
        }
    };

    render() {

        var {businessStore} = this.props.route;

        if (!businessStore) {
            return null;
        }


        var business = businessStore.business;

        console.log(business);

        return (
            <div className="Settings">
                <h1>עדכון פרטים</h1>

                <Paper className="Settings-paper">
                    <div>
                        <form>
                            <TextField name="clientName" defaultValue={business.title} onChange={this.onChange} hintText="שם בית העסק"/>
                            <TextField name="address" defaultValue={business.address} onChange={this.onChange} hintText="כתובת"/>
                            <TextField name="description" defaultValue={business.description} multiLine={true} onChange={this.onChange} hintText="תיאור בית עסק"/>
                            <TextField name="businessType" defaultValue={business.businessType} onChange={this.onChange} hintText="סוג בית עסק"/>
                            <TextField name="phone" defaultValue={business.phone}  onChange={this.onChange} hintText="מספר טלפון"/>
                            <TextField name="website" defaultValue={business.website} onChange={this.onChange} hintText="אתר אינטרנט"/>
                            <TextField name="facebook" defaultValue={business.facebook} onChange={this.onChange} hintText="דף פייסבוק"/>

                            <ImageUploader
                                name="avatar"
                                storageRef={firebase.storage().ref('images')}
                                onUploadStart={this.handleUploadStart}
                                onUploadError={this.handleUploadError}
                                onUploadSuccess={this.handleUploadSuccess}
                                onProgress={this.handleProgress}
                            />

                            <Avatar style={{margin: '20px auto', display: 'block'}} size={100}
                                    backgroundColor={pinkA200}
                                    src={business.imageUrl}/>
                        </form>

                    </div>
                    <RaisedButton primary onClick={this.save}>שמור</RaisedButton>

                </Paper>

            </div>
        );


    }


}


