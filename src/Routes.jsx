import React from 'react';
import {Route, IndexRoute} from 'react-router'

import App from './components/App'
import Login from './components/Login'
import Offers from './components/offers/Offers'
import Clients from './components/Clients/Clients'

export default(stores) => {
	return (
		<Route path="/" component={App} businessStore={stores.businessStore}>
			<IndexRoute component={Login} businessStore={stores.businessStore}  offerStore={stores.offerStore}  authStore={stores.authStore}/>
			<Route path="offers" component={Offers} offerStore={stores.offerStore} businessStore={stores.businessStore}/>
			<Route path="clients" component={Clients} clientStore={stores.clientStore}/>
		</Route>
	)
}
