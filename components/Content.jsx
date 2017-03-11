import CSSModules from 'react-css-modules'
import React from 'react'
import ReactDOM from 'react-dom'
import DevTool from 'mobx-react-devtools'
import {observer} from 'mobx-react'
import {observable} from 'mobx';
import NavigationBar from './NavigationBar'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import NavItem from './NavigationItem'

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

        var menuIconClass = 'menu-hamburger';

        return (

            <div>
                {businessStore.isLoggedIn && this.isMobile() &&
                <div>
                    <AppBar
                        title="Title"
                        iconClassNameRight="muidocs-icon-navigation-expand-more"
                        onLeftIconButtonTouchTap={()=> this.handleSideMenuToggle()}
                    />
                    <Drawer docked={false} open={NavOpen} onRequestChange={(NavOpen) => this.setState({NavOpen})} businessStore={businessStore}>
                        {!businessStore.isLoggedIn &&<MenuItem><NavItem to='/' index={true}>Login {businessStore.isLoggedIn}</NavItem></MenuItem>}
                        {businessStore.isLoggedIn && <MenuItem><NavItem to='/offers'> Offers</NavItem></MenuItem>}
                        {businessStore.isLoggedIn && <MenuItem><NavItem to='/clients'> Clients</NavItem></MenuItem>}
                    </Drawer>

                </div>
                }

                {/*{businessStore.isLoggedIn && !this.isMobile() &&*/}
                {/*<NavigationBar businessStore={businessStore}/>*/}
                {/*}*/}


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

