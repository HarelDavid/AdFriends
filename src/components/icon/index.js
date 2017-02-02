import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

import './style.scss';

export default class Icon extends Component {
    render() {
        var {className, type, ...otherProps} = this.props;

        className = classNames('Icon', className, 'icon-' + type);

        return (
            <span {...otherProps} className={className}></span>
        );
    }
}
