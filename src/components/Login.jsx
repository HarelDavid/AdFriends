import React, {Component} from 'react';
import autobind from 'autobind-decorator'
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {hashHistory} from 'react-router';
import firebase from 'firebase';
import RaisedButton from 'material-ui/RaisedButton';

const LOGIN_PROVIDERS = {
    FACEBOOK: 'facebook',
    GOOGLE: 'google'
}


const ERRORS = {
    ACCOUNT_EXISTS_WITH_DIFFERENT_CREDENTIALS: {
    	CODE: "auth/account-exists-with-different-credential",
		TEXT: "Account exists with different credentials"
	}
}
@observer
export default class Login extends Component {

    @observable
    state = {
        errorMessage: ""
    }

	componentDidMount () {
		var {businessStore} = this.props.route;

		businessStore.isLoggedIn && hashHistory.push('/#/offers/');
		console.log(businessStore.isLoggedIn);
	}


	handelLoginFail( error){
        switch(error.code) {
			case  ERRORS.ACCOUNT_EXISTS_WITH_DIFFERENT_CREDENTIALS.CODE : {
                this.state.errorMessage = ERRORS.ACCOUNT_EXISTS_WITH_DIFFERENT_CREDENTIALS.TEXT
				break;
			}
			default: {

			}
        }
	}


	@autobind
    providerLogin(providerName) {
        var {businessStore} = this.props.route;
        var provider = providerName == LOGIN_PROVIDERS.GOOGLE ?
            new firebase.auth.GoogleAuthProvider() :
            new firebase.auth.FacebookAuthProvider();

        return firebase.auth().signInWithPopup(provider).then((result) => {
            return businessStore.handleLoginSuccess(result);
        })
		.then(() => {
            hashHistory.push('/offers');
		})
		.catch((error) => {
			this.handelLoginFail(error);
		});
    }


	render() {
		return (
			<div>
			{/*<h2>להמשך אנא התחבר:</h2>*/}
			<div>
				{/*<RaisedButton primary onClick={() => this.providerLogin(LOGIN_PROVIDERS.GOOGLE)}>Google Login</RaisedButton>*/}
				<RaisedButton onClick={() => this.providerLogin(LOGIN_PROVIDERS.FACEBOOK)}
							  backgroundColor="#3e60aa" labelColor="#ffffff" labelStyle={{fontSize: 22, color: '#fff'}}
							  style={{width: 260, margin: '40px auto', display: 'block', borderRadius: 30, overflow: 'hidden'}}>
					התחבר עם פייסבוק
				</RaisedButton>
			</div>
			</div>
		);
	}


}



