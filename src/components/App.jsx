import React from 'react'
import DevTool from 'mobx-react-devtools'
import {observer} from 'mobx-react'
import {observable} from 'mobx';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Content from './Content';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {grey800} from 'material-ui/styles/colors';
import CircularProgress from 'material-ui/CircularProgress';

import  './app.scss';

const muiTheme = getMuiTheme({
    isRtl: true,
    palette: {
		primary1Color: "#585D91",
		accent1Color: "#50BAB4",
        textColor: grey800,
    },
    fontFamily: 'Assistant, sans-serif',
    appBar: {
        height: 50,
    },
	TextField: {
        height: 'auto'
    },
	RaisedButton: {
        color: 'white'
    }
});

@observer
export default class App extends React.Component {



    render() {
        var {businessStore} = this.props.route;

        return (

            <MuiThemeProvider className="container" muiTheme={muiTheme}>
                {/*<DevTool/>*/}
				{businessStore.isInitialized ?
                    <Content businessStore={businessStore} children={this.props.children}/>
					:
                    <div className="Loader-wrapper">
                        <CircularProgress size={80} thickness={5} color="#50BAB4"/>
                    </div>
				}
            </MuiThemeProvider>
        )

    }
}

