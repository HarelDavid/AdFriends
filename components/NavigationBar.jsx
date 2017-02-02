import React from 'react'
import CSSModules from 'react-css-modules'
import {observer} from 'mobx-react';

import NavItem from './NavigationItem'
import styles from './NavigationBar.scss'

@observer
class NavigationBar extends React.Component {


	render() {

		var {businessStore} = this.props;

		if(!businessStore) {
			return null;
		}

		return (
			<nav className={styles.nav}>
				<div className={styles.container}>
					<div className={styles.header}>
						<a className={styles.brand} href="#">
							<div className={styles.user}> </div>
						</a>
					</div>
					<div className={styles.menu_list}>
						<div className={styles.name}>Hello, {businessStore.business && businessStore.business.title}</div>

						<ul className={styles.nav_list}>
							{!businessStore.isLoggedIn &&<NavItem to='/' index={true}>Login {businessStore.isLoggedIn}</NavItem>}
							{businessStore.isLoggedIn && <NavItem to='/offers'><span className="icon-offers"></span> Offers</NavItem>}
							{businessStore.isLoggedIn && <NavItem to='/clients'><span className="icon-clients"></span> Clients</NavItem>}
							{businessStore.isLoggedIn && <NavItem to='/Friends'><span className="icon-friends"></span> Friends</NavItem>}
						</ul>
					</div>
				</div>
			</nav>
		)
	}
}

export default CSSModules(NavigationBar, styles, {allowMultiple: true})
