import React from 'react'
import PropTypes from 'prop-types'
import { Breadcrumb, Icon } from 'antd'
import { Link } from 'dva/router'
import styles from './Bread.less'
import pathToRegexp from 'path-to-regexp'
import { queryArray } from 'utils'
import store from 'store';
import { FormattedMessage } from 'react-intl'
const Bread = ({ menu }) => {
  // 匹配当前路由
  let pathArray = []
  let current
  menu.filter((item) => {
    return item.name !== 'accounts' || item.name !== 'Support'
  })

  for (let index in menu) {
    if (menu[index].route && pathToRegexp(menu[index].route).exec(location.pathname)) {
      current = menu[index]
      break
    }
  }

  const getPathArray = (item) => {
    pathArray.unshift(item)
    if (item.bpid) {
      getPathArray(queryArray(menu, item.bpid, 'id'))
    }
  }

  if (!current) {
    if (location.pathname.indexOf('sendConfirm') !== -1 || location.pathname.indexOf('sendSuccess') !== -1) {
      pathArray.push({
        id: 1,
        icon: '',
        name: 'general_menu_text_send_receive',
        route: '/sendreceive',
      })
      pathArray.push({
        id: 2,
        icon: '',
        name: '  ',
      })
    }
    if (location.pathname.indexOf('transaction') !== -1) {
      const currencyName = location.pathname.split('/')[3].toUpperCase()
      pathArray.push({
        id: 1,
        icon: '',
        name: 'general_menu_text_mywallets',
        route: '/myWallets',
      })
      pathArray.push({
        id: 2,
        icon: '',
        name: currencyName,
      })
    }
    if(location.pathname === '/') {
      pathArray.push({
        id: 1,
        icon: '',
        name: 'MyWallets',
        route: '/myWallets',
      })
      pathArray.push({
        id: 404,
        name: '  ',
      })
    }
  } else {
    getPathArray(current)
  }

  // 递归查找父级
  const breads = pathArray.map((item, key) => {
    const content = (
      <span>{item.icon
          ? <Icon type={item.icon} style={{ marginRight: 4 }} />
          : ''}<FormattedMessage id={item.name} /></span>
    )
    return (
      <Breadcrumb.Item key={key}>
        {((pathArray.length - 1) !== key)
          ? <Link to={item.route}>
              {content}
          </Link>
          : content}
      </Breadcrumb.Item>
    )
  })

  return (
    <div className={styles.bread}>
      <Breadcrumb>
        {breads}
      </Breadcrumb>
    </div>
  )
}

Bread.propTypes = {
  menu: PropTypes.array,
}

export default Bread
