import CSSModules from 'react-css-modules'
import React from 'react';
import {observer} from 'mobx-react';
import Offer from './Offer'
import OfferEntry from './OfferEntry'

import style from './style.scss';
Object.assign(style)


@observer
class Offers extends React.Component {

	render() {

		const {offerStore, businessStore} = this.props.route;

		return (

			<div className={style.wrapper}>
				<h1>{businessStore.business && businessStore.business.title} Your Offers:</h1>

				<div className={style.entry}>
					<OfferEntry offerStore={offerStore}/>
				</div>
				<div className={style.list}>
				{offerStore.offers.map((offer) => (
						<Offer className={style.item} key={offer.id} offer={offer}/>
					)
				)}
				</div>
			</div>


		)
	}
}

export default CSSModules(Offers, style);
