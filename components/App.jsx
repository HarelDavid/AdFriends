import CSSModules from 'react-css-modules'
import React from 'react'
import ReactDOM from 'react-dom'
import DevTool from 'mobx-react-devtools'
import {observer} from 'mobx-react'
import {observable} from 'mobx';
import NavigationBar from './NavigationBar'

import styles from './app.scss'
Object.assign(styles)

@observer
class App extends React.Component {



    render() {
        var  {businessStore} = this.props.route;
        return (
            <div className={styles.container}>
                {/*<DevTool/>*/}
                <div className={styles.top_nav}></div>

                {businessStore.isLoggedIn  && <NavigationBar businessStore={businessStore}/>}
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