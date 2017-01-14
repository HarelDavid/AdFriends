import React from 'react'
import CSSModules from 'react-css-modules'

import NavItem from './NavigationItem'
import styles from './NavigationBar.scss'

class NavigationBar extends React.Component {
	render() {
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
							<NavItem to='/' index={true} >Home</NavItem>
							<NavItem to='/offers'>Offers</NavItem>
							<NavItem to='/clients'>Clients</NavItem>
						</ul>
					</div>
				</div>
			</nav>
		)
	}
}

export default CSSModules(NavigationBar, styles, {allowMultiple: true})
