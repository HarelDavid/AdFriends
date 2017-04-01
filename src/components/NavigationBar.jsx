import React from 'react'
import CSSModules from 'react-css-modules'
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {Link} from 'react-router';
import autobind from 'autobind-decorator'
import NavItem from './NavigationItem'
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';
import {pinkA200} from 'material-ui/styles/colors';

import styles from './NavigationBar.scss'

@observer

export default class NavigationBar extends React.Component {

	@autobind
	logout(){
		var {businessStore} = this.props;
		businessStore && businessStore.logout();
	}

    @observable state = {
        NavOpen: false
    }

    isMobile() {
        let mql = window.matchMedia('(max-width: 920px)');
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && mql.matches) {
            return true;
        }
        return false;
    }

    handleSideMenuToggle() {
        this.setState({NavOpen: !this.state.NavOpen});
    }



    render() {

		var {businessStore} = this.props;
        var {NavOpen} = this.state;

		if(!businessStore) {
			return null;
		}

		console.log(businessStore)

		return (
			<div  className="NavigationBar">
				<AppBar
					title="Add Friend"
					iconElementLeft={!this.isMobile() && <div className="menu-hamburger"></div>}
					onLeftIconButtonTouchTap={() => this.handleSideMenuToggle()}
					iconElementRight={businessStore.isLoggedIn ? <FlatButton label="Log Out" onClick={businessStore.logout}/> :
						<Link to='/'><FlatButton label="Log In"/></Link>}
				/>
                {businessStore.isLoggedIn &&
				<Drawer docked={!this.isMobile()} open={this.isMobile() ? NavOpen : true}
						onRequestChange={(NavOpen) => this.setState({NavOpen})}
						businessStore={businessStore}>

					<Avatar style={{margin: '20px auto', display: 'block'}} size={100} backgroundColor={pinkA200}
							src={businessStore.business.imageUrl}/>

					<MenuItem><NavItem onTouchTap={() => this.handleSideMenuToggle()} to='/offers'>מבצעים</NavItem></MenuItem>
					<MenuItem><NavItem onTouchTap={() => this.handleSideMenuToggle()} to='/clients'>לקוחות</NavItem></MenuItem>
					<MenuItem><NavItem onTouchTap={() => this.handleSideMenuToggle()} to='/settings'>הגדרות</NavItem></MenuItem>
				</Drawer>
                }
			</div>
		)
	}
}

