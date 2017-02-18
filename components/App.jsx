import CSSModules from 'react-css-modules'
import React from 'react'
import ReactDOM from 'react-dom'
import DevTool from 'mobx-react-devtools'
import {observer} from 'mobx-react'
import {observable} from 'mobx';
import NavigationBar from './NavigationBar'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import styles from './app.scss'
Object.assign(styles)

@observer
class App extends React.Component {

    @observable state = {
        MobileNavOpen: false
    }

    isMobile() {
        let mql = window.matchMedia('(max-width: 920px)');
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && mql.matches) {
            return true;
        }
        return false;
    }

    handleSideMenuToggle() {
        setTimeout(() => {
            this.state.MobileNavOpen = !this.state.MobileNavOpen;
        }, 50)
    }

    render() {
        var {businessStore} = this.props.route;
        var {MobileNavOpen} = this.state;

        var menuIconClass = 'menu-hamburger';
        if (MobileNavOpen) menuIconClass += ' open';

        return (
            <div className={styles.container}>
                {/*<DevTool/>*/}

                {businessStore.isLoggedIn && this.isMobile() &&
                <div>
                    <div className={styles.top_nav}>
                        <div className={menuIconClass} tabIndex="10000"
                             onFocus={() => this.handleSideMenuToggle()}
                             onBlur={() => this.handleSideMenuToggle()}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                    {MobileNavOpen &&
                    <ReactCSSTransitionGroup transitionName="mobileMenuAnimation"
                                             transitionEnterTimeout={150} transitionLeaveTimeout={300}>
                        <NavigationBar businessStore={businessStore} open={MobileNavOpen}/>
                    </ReactCSSTransitionGroup>
                    }
                </div>
                }

                {businessStore.isLoggedIn && !this.isMobile() &&
                    <NavigationBar businessStore={businessStore}/>
                }


                <div className={styles.content_wrapper}>
                    <div></div>
                    <div className={styles.content}>
                        {this.props.children}
                    </div>
                    <div className="Overlay"></div>
                </div>

            </div>
        );
    }
}

export default CSSModules(App, styles)
