import CSSModules from 'react-css-modules'
import React from 'react'
import ReactDOM from 'react-dom'
import DevTool from 'mobx-react-devtools'
import {observer} from 'mobx-react'
import {observable} from 'mobx';
import NavigationBar from './NavigationBar'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Content from './Content';

import styles from './app.scss'
Object.assign(styles)

@observer
export default class App extends React.Component {


    render() {
        var {businessStore} = this.props.route;

        return (
            <MuiThemeProvider className="container">
                {/*<DevTool/>*/}

               <Content businessStore={businessStore}/>

            </MuiThemeProvider>
        );
    }
}

