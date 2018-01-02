import React, {Component} from 'react';
import autobind from 'autobind-decorator'
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {hashHistory, Link} from 'react-router';
import firebase from 'firebase';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';

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
		errorMessage: "",
		checked: true
	}

	componentDidMount() {
		var {businessStore} = this.props.route;

		businessStore.isLoggedIn && hashHistory.push('/offers');
		// console.log(businessStore.isLoggedIn);
	}


	handelLoginFail(error) {
		switch (error.code) {
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
			.catch((error) => {
				this.handelLoginFail(error);
			});
	}

	@autobind
	updateCheck() {
		this.state.checked = !this.state.checked;
	}


	render() {


		let buttonStyles = {
			width: '100%',
			margin: '15px auto',
			display: 'block',
			borderRadius: 30,
			overflow: 'hidden',
			color: '#fff',
			height: 42
		};

		return (
			<div>
				{/*<h2>להמשך אנא התחבר:</h2>*/}
				<div style={{
					width: '100%',
					height: '70vh',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					maxWidth: 360,
					margin: '0 auto'
				}}>
					<RaisedButton onClick={() => this.providerLogin(LOGIN_PROVIDERS.FACEBOOK)}
								  backgroundColor="#3e60aa" labelColor="#ffffff"
								  labelStyle={{fontSize: 18, color: '#fff'}} label="Facebook Login"
								  style={buttonStyles} disabled={!this.state.checked}/>
					<RaisedButton onClick={() => this.providerLogin(LOGIN_PROVIDERS.GOOGLE)}
								  backgroundColor="#ff5a60" labelColor="#ffffff"
								  labelStyle={{fontSize: 18, color: '#fff'}} label="Google Login"
								  style={buttonStyles} disabled={!this.state.checked}/>

					<div style={{display: 'flex', alignItems: 'center', marginTop: 40}}>
						<Checkbox style={{width: 'auto'}}
							checked={this.state.checked}
							onCheck={() => this.updateCheck()}
						/> אני מאשר את &nbsp;<a target="_blank" href="https://firebasestorage.googleapis.com/v0/b/adfriend-73789.appspot.com/o/AdFriend_%D7%AA%D7%A0%D7%90%D7%99_%D7%A9%D7%99%D7%9E%D7%95%D7%A9.pdf?alt=media&token=5085ffd3-a827-417f-a40f-ab0fde304d6c" style={{color: '#555'}}>תנאי השימוש</a>
					</div>
				</div>
			</div>
		);
	}


}



