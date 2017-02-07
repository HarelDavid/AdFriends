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
        title: PropTypes.string,
        isOpen: PropTypes.bool
    }


    componentDidMount(){
        // document.body.classList.add('showOverlay');
    }



    render() {

        var {title, children, isOpen} = this.props;

        if(!isOpen)
            return null;

        return (
            <div>
                    <div className={style.Modal}>
                        <h2>{title}</h2>
                        {children}
                    </div>
            </div>

        )
    }
}

export default CSSModules(Offers, style);
