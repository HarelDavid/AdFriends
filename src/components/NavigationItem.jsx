import React, { Component } from 'react'
import { Link, IndexLink, withRouter } from 'react-router'
import FlatButton from 'material-ui/FlatButton';

class NavItem extends Component {
  render () {
    const { router } = this.props
    const { index, to, children, ...props } = this.props

    const LinkComponent = index ?  IndexLink : Link

    return (

        <LinkComponent to={to} {...props}>
          <FlatButton primary={router.isActive(to,true)}>{children}</FlatButton>
        </LinkComponent>

    )
  }
}

NavItem = withRouter(NavItem)

export default NavItem
