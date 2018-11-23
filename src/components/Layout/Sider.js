import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Switch } from 'antd'
import styles from './Layout.less'
import { config } from 'utils'
import Menus from './Menu'
import siderLogo from '../../../public/mobi_logo_web-app.png';
import { logout } from '../../utils';
import { FormattedMessage } from 'react-intl'
const Sider = ({ siderFold, darkTheme, location, changeTheme, navOpenKeys, changeOpenKeys, menu }) => {
  const menusProps = {
    menu,
    siderFold,
    darkTheme,
    location,
    navOpenKeys,
    changeOpenKeys,
  }
  return (
    <div className={styles.siderWraper}>
      <div className={styles.logo}>
        <img alt={'logo'} src={siderLogo} />
      </div>
      <Menus {...menusProps} />
      <p style={{ paddingLeft: 24, cursor: 'pointer'}} onClick={() => {logout()}}><FormattedMessage id='nav_header_link_log_out'/></p>
    </div>
  )
}

Sider.propTypes = {
  menu: PropTypes.array,
  siderFold: PropTypes.bool,
  darkTheme: PropTypes.bool,
  location: PropTypes.object,
  changeTheme: PropTypes.func,
  navOpenKeys: PropTypes.array,
  changeOpenKeys: PropTypes.func,
}

export default Sider
