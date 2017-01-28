import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import autobind from 'autobind-decorator'
import {observer} from 'mobx-react';
import firebase from 'firebase';




@observer
export default class Login extends Component {

	authUi;
	componentDidMount () {
		var self = this;

		var {businessStore, authStore, OfferStore, ClientStore} = this.props.route;
		var uiConfig = this.getConfig(businessStore);
		authStore.authUi.start('.firebaseui-auth', uiConfig);
	}

	initStores(bussines){
		var {offerStore} = this.props.route;

		offerStore.init(bussines);
		//this.props.clientStore.init(bussines);
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
			credentialHelper:firebaseui.auth.CredentialHelper.NONE,

			'callbacks': {
				'signInSuccess': function(currentUser,credential) {
					if(currentUser){
						return businessStore.login(currentUser, credential)
							.then((business) => {
								_this.initStores(business);
								//return false;
							})

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

					scopes:[
						'public_profile',
						'email',
						'user_birthday'
					]
				}
			]
		};
		return uiConfig;
	}

	render() {
		return (
			<div>
				<div onClick={() =>this.reset()}>back</div>
				<div className="firebaseui-auth"  ></div>
			</div>
		);
	}


}



