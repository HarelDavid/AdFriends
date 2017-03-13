import React from 'react';
import {Route, IndexRoute} from 'react-router'

import App from './components/App'
import Login from './components/Login'
import Offers from './components/offers/Offers'
import OfferEntry from './components/offers/OfferEntry';
import Clients from './components/Clients/Clients'
import ClientOfferPreview from './components/preview/ClientOfferPreview'

export default(stores) => {
	return (

		<Route path="/" component={App} businessStore={stores.businessStore}>
			<IndexRoute component={Login} businessStore={stores.businessStore}    authStore={stores.authStore}/>
			<Route path="offers" component={Offers}  businessStore={stores.businessStore} couponsStore={stores.couponStore}/>
			<Route path="offer/new-offer" component={OfferEntry}  businessStore={stores.businessStore} couponsStore={stores.couponStore}/>
			<Route path="offer/:offerId" component={OfferEntry}  businessStore={stores.businessStore} couponsStore={stores.couponStore}/>
			<Route path="clients" component={Clients} businessStore={stores.businessStore}/>
			<Route path="coupon/:couponId" component={ClientOfferPreview} />
			<Route path="coupon/:couponId/preview" component={ClientOfferPreview} businessStore={stores.businessStore}/>
		</Route>
	)
}
