import React from 'react'
import CSSModules from 'react-css-modules'
import {observer} from 'mobx-react';

import NavItem from './NavigationItem'
import styles from './NavigationBar.scss'

@observer
class NavigationBar extends React.Component {
	render() {

		var {businessStore} = this.props;
		return (
			<nav className={styles.nav}>
				<div className={styles.container}>
					<div className={styles.header}>
						<a className={styles.brand} href="#">
							<div className={styles.user}></div>
						</a>
					</div>
					<div className={styles.menu_list}>
						<ul className={styles.nav_list}>
							<NavItem to='/' index={true} >Home {businessStore.isLoggedIn}</NavItem>
							{businessStore.isLoggedIn && <NavItem to='/offers'>Offers</NavItem>}
							{businessStore.isLoggedIn && <NavItem to='/clients'>Clients</NavItem>}
						</ul>
					</div>
				</div>
			</nav>
		)
	}
}

export default CSSModules(NavigationBar, styles, {allowMultiple: true})
