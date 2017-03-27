import React from 'react'
import DevTool from 'mobx-react-devtools'
import {observer} from 'mobx-react'
import {observable} from 'mobx';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Content from './Content';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {grey800} from 'material-ui/styles/colors';

import  './app.scss';

const muiTheme = getMuiTheme({
    isRtl: true,
    palette: {
        textColor: grey800,
    },
    fontFamily: 'Assistant, sans-serif',
    appBar: {
        height: 50,
    },
});

@observer
export default class App extends React.Component {



    render() {
        var {businessStore} = this.props.route;

        return businessStore.isInitialized ? (

            <MuiThemeProvider className="container" muiTheme={muiTheme}>
                {/*<DevTool/>*/}
                <Content businessStore={businessStore} children={this.props.children}/>
            </MuiThemeProvider>
        )
            :
            <div>loading</div>

    }
}

