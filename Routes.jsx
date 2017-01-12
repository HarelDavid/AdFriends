import React from 'react';
import {Route, IndexRoute} from 'react-router'
import App from './components/App'
import About from './components/About'
import Offers from './components/offers/Offers'
import Clients from './components/Clients/Clients'

export default(stores) => {
	return (
		<Route path="/" component={App} offerStore={stores.offerStore}>
			<IndexRoute component={About}/>
			<Route path="offers" component={Offers} offerStore={stores.offerStore}/>
			<Route path="clients" component={Clients} clientStore={stores.clientStore}/>
		</Route>
	)
}
