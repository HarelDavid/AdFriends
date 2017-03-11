import CSSModules from 'react-css-modules'
import React from 'react'
import ReactDOM from 'react-dom'
import DevTool from 'mobx-react-devtools'
import {observer} from 'mobx-react'
import {observable} from 'mobx';
import {Link} from 'react-router';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Avatar from 'material-ui/Avatar';
import NavItem from './NavigationItem'
import FontIcon from 'material-ui/FontIcon';
import {pinkA200} from 'material-ui/styles/colors';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
import styles from './app.scss'
Object.assign(styles)

@observer
export default class Content extends React.Component {

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

        return (

            <div>

                <div>
                    <AppBar
                        title="Add Friend"
                        iconClassNameRight="muidocs-icon-navigation-expand-more"
                        onLeftIconButtonTouchTap={() => this.handleSideMenuToggle()}
                        iconElementRight={businessStore.isLoggedIn ? <FlatButton label="Log Out"/> :
                            <Link to='/'><FlatButton label="Log In"/></Link>}
                    />
                    {businessStore.isLoggedIn &&
                    <Drawer docked={!this.isMobile()} open={this.isMobile() ? NavOpen : true}
                            onRequestChange={(NavOpen) => this.setState({NavOpen})}
                            businessStore={businessStore}>

                        <Avatar style={{margin: '20px auto', display: 'block'}} size={100} backgroundColor={pinkA200} icon={<FontIcon className="material-icons">face</FontIcon>}/>
                        <MenuItem><NavItem to='/offers'> Offers</NavItem></MenuItem>
                        <MenuItem><NavItem to='/clients'> Clients</NavItem></MenuItem>
                        <MenuItem><NavItem to='/settings'>Settings</NavItem></MenuItem>
                    </Drawer>
                    }
                </div>


                <div className="wrapper">
                    <div></div>
                    <div className="content">
                        {this.props.children}
                    </div>
                    <div className="Overlay"></div>
                </div>
            </div>
        );
    }
}

