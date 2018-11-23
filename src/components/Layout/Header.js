import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Icon, Popover, Select, Avatar, Dropdown } from 'antd'
import styles from './Header.less'
import Menus from './Menu'
import Bread from './Bread';
import store from 'store';
import { logout } from '../../utils'
import defaultAvatar from '../../../public/default_avatar.png';
import LangSelect from '../../components/langSelect';

const SubMenu = Menu.SubMenu

const Header = ({ i18n, changeLanguage, user, switchSider, siderFold, isNavbar, menuPopoverVisible, location, switchMenuPopover, navOpenKeys, changeOpenKeys, menu, userInfo }) => {
  const menusProps = {
    menu,
    siderFold: false,
    darkTheme: false,
    isNavbar,
    handleClickNavMenu: switchMenuPopover,
    location,
    navOpenKeys,
    changeOpenKeys,
  }
  const breadProps = {
    menu,
  }
// const UserInfoMenu = (
//   <Menu>
//     <Menu.Item key="0">
//       <a target="_blank" rel="noopener noreferrer" href="/mywallets">My Wallets</a>
//     </Menu.Item>
//     <Menu.Item key="1">
//       <a target="_blank" rel="noopener noreferrer" onClick={() => {logout()}}>Log Out</a>
//     </Menu.Item>
//   </Menu>
// );
  return (
    <div className={styles.header}>
      <div className={styles.leftWrapper}>
        {isNavbar
          ? <Popover placement="bottomLeft" onVisibleChange={switchMenuPopover} visible={menuPopoverVisible} overlayClassName={styles.popovermenu} trigger="click" content={<Menus {...menusProps} />}>
            <div className={styles.button}>
              <Icon type="bars" />
            </div>
          </Popover>
          : ''}
        <Bread {...breadProps}/>
      </div>
      <div className={styles.rightWarpper}>
          <div className={styles.userInfoWrapper}>
            <Avatar src={userInfo.userAvatar || defaultAvatar}/>
            <span className={styles.userName}>{userInfo.userName}</span>
          </div>
          <LangSelect
            i18n={i18n}
            changeLanguage={(lang) => {
              changeLanguage(lang)
            }}
          />
      </div>
    </div>
  )
}

Header.propTypes = {
  menu: PropTypes.array,
  logout: PropTypes.func,
  switchSider: PropTypes.func,
  siderFold: PropTypes.bool,
  isNavbar: PropTypes.bool,
  menuPopoverVisible: PropTypes.bool,
  location: PropTypes.object,
  switchMenuPopover: PropTypes.func,
  navOpenKeys: PropTypes.array,
  changeOpenKeys: PropTypes.func,
}

export default Header
