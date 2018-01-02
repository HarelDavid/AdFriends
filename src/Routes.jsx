import React from 'react';
import {Route, IndexRoute} from 'react-router'

import App from './components/App'
import Login from './components/Login'
import Offers from './components/offers/Offers'
import Clients from './components/Clients/Clients'
import settings from './components/settings/settings';
import Coupons from './components/Coupons/Coupons';
import template from './components/templates/template';


export default(stores) => {
	return (

		<Route path="/"  component={App} businessStore={stores.businessStore}>
			<IndexRoute component={Login} businessStore={stores.businessStore}    authStore={stores.authStore}/>
			<Route path="offers" component={Offers}  businessStore={stores.businessStore} couponsStore={stores.couponStore}/>
			<Route path="offer/new/:templateId" component={template}  businessStore={stores.businessStore} couponsStore={stores.couponStore}/>
			<Route path="offer/:offerId" component={template}  businessStore={stores.businessStore} couponsStore={stores.couponStore}/>
			<Route path="clients" component={Clients} businessStore={stores.businessStore}/>
			<Route path="coupons" component={Coupons} businessStore={stores.businessStore} couponsStore={stores.couponStore}/>
			<Route path="settings" component={settings} businessStore={stores.businessStore}/>
		</Route>
	)
}
