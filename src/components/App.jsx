import CSSModules from 'react-css-modules'
import {container, jumbotron, buttons} from 'bootstrap-css'
import React from 'react'
import ReactDOM from 'react-dom'
import DevTool from 'mobx-react-devtools'
import {observer} from 'mobx-react'

import About from './About'
import NavigationBar from './NavigationBar'

import styles from './App.css'
Object.assign(styles, jumbotron, container, buttons)

@observer
class App extends React.Component {
	render() {
		const {offerStore} = this.props.route
		return (
			<div className={styles.container}>
				<DevTool/>
				<NavigationBar/>
				<div className={styles.appHeading}>
					<h1>An App</h1>
					<p>You have a total of {offerStore.offerCount} guests.</p>
					{this.props.children}
				</div>

			</div>
		);
	}
}

export default CSSModules(App, styles)
