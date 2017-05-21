import React, {Component} from 'react';
import {Link} from 'react-router';
import autobind from 'autobind-decorator'
import {observer} from 'mobx-react';
import firebase from 'firebase';




@observer
export default class Login extends Component {

	authUi;

	componentDidMount () {
		var {businessStore, authStore} = this.props.route;
		var uiConfig = this.getConfig(businessStore);
		authStore.authUi.start('.firebaseui-auth', uiConfig);

	}

	initStores(bussines){
		var {offerStore} = this.props.route;
		offerStore.init(bussines);
	}



	@autobind
	reset(){
		var {authStore} = this.props.route;
		var uiConfig = this.getConfig();
		authStore.authUi.reset();
		authStore.authUi.start('.firebaseui-auth', uiConfig);
	}


	getConfig(businessStore){


		var _this = this;
		var uiConfig = {

			signInFlow:  'popup',
			signInSuccessUrl: window.location.href,
			credentialHelper:firebaseui.auth.CredentialHelper.NONE,

			'callbacks': {
				'signInSuccess': function(currentUser,credential) {
					if(credential){
						return businessStore.getProviderData(credential.accessToken)
						if(currentUser){
							businessStore.login(currentUser, credential);
							return false;
						}
					}
					if(currentUser){
						businessStore.login(currentUser, credential);
						return false;
					}
					return false;

				}
			},
			'signInOptions': [
				{
					provider:firebase.auth.GoogleAuthProvider.PROVIDER_ID,
					scopes: ['https://www.googleapis.com/auth/userinfo.profile']
				},
				{
					provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,

					scopes: [
						'public_profile',
						'email'
					]
				}
			]
		};
		return uiConfig;
	}

	// componentDidMount(){
	// 	// document.getElementsByClassName("input")[1].innerHTML="This message was written via JS script! "; // Fills the text box message
	// 	// var input = document.getElementsByClassName("icon btn-icon icon-send");//Grabs the send button
	// 	// input[0].click();// Clicks the send button
	// }

	render() {

		return (
			<div>
			<div>WELCOME , PLEASE LOGIN</div>
			<div>
				<div className="firebaseui-auth"  ></div>
			</div>
			</div>
		);
	}


}



