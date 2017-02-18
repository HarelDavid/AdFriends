import React, {PropTypes} from 'react';
import CSSModules from 'react-css-modules'
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import classname from 'classnames';
import autobind from 'autobind-decorator'

import style from './style.scss';
Object.assign(style)


@observer
class Offers extends React.Component {

    static propTypes = {
        title: PropTypes.string
    }

    @observable
    state = {
        open: true
    }

    componentDidMount(){
        document.body.classList.add('showOverlay');

    }

    open() {
        this.setState({open: true});
        document.body.classList.add('showOverlay');
    }

    close() {
        this.setState({open: false});
        document.body.classList.remove('showOverlay');
    }

    render() {

        var {title, children} = this.props;
        var {open} = this.state;


        return (
            <div>
                {open ?
                    <div className={style.Modal}>
                        <h2>{title}</h2>
                        <div onClick={()=>this.close()}>X</div>
                        {children}
                    </div>
                    : null }
            </div>

        )
    }
}

export default CSSModules(Offers, style);
