import React from 'react';
import {observer} from 'mobx-react';
import Offer from './Offer'
import OfferEntry from './OfferEntry'

@observer
export default class Offers extends React.Component {

	render() {

		const {offerStore} = this.props.route;

		return (


			<div>
				<div>The Offers :</div>
				{offerStore.offers.map((offer) => (
						<Offer key={offer.title} offer={offer}/>
					)
				)}
				<OfferEntry offerStore={offerStore}/>
			</div>


		)
	}
}
