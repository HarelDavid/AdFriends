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

    componentDidMount() {
        document.body.classList.add('showOverlay');
    }

    componentWillUnmount() {
        document.body.classList.remove('showOverlay');
    }

        render() {

        var {title, children} = this.props;

        return (

                <div className={style.Modal}>
                    <h2>{title}</h2>

                    {children}
                </div>

        )
    }
}

export default CSSModules(Offers, style);
