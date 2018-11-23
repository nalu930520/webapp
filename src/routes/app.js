import React from 'react'
import PropTypes from 'prop-types'
import pathToRegexp from 'path-to-regexp'
import { connect } from 'dva'
import { Layout, Loader } from 'components'
import { classnames, config } from 'utils'
import { Helmet } from 'react-helmet'
import '../themes/index.less'
import './app.less'
import NProgress from 'nprogress'
import Error from './error'
import store from 'store'
import { IntlProvider } from 'react-intl';

const { prefix, openPages } = config

const { Header, Bread, Footer, Sider, styles } = Layout

const App = ({ children, dispatch, app, loading, location, i18n }) => {
  const { isNavbar, menuPopoverVisible, navOpenKeys, menu, permissions} = app
  const darkTheme = true
  const siderFold = false
  const userInfo = store.get('userInfo');
  let { pathname } = location
  pathname = pathname.startsWith('/') ? pathname : `/${pathname}`
  const { iconFontJS, iconFontCSS, logo } = config
  const current = menu.filter(item => pathToRegexp(item.route || '').exec(pathname))
  const hasPermission = true
  const href = window.location.href

  const headerProps = {
    menu,
    siderFold,
    isNavbar,
    userInfo,
    i18n,
    menuPopoverVisible,
    navOpenKeys,
    changeLanguage (lang) {
      dispatch({ type: 'i18n/setLocale', locale: lang })
    },
    switchMenuPopover () {
      dispatch({ type: 'app/switchMenuPopver' })
    },
    logout () {
      dispatch({ type: 'app/logout' })
    },
    switchSider () {
      dispatch({ type: 'app/switchSider' })
    },
    changeOpenKeys (openKeys) {
      dispatch({ type: 'app/handleNavOpenKeys', payload: { navOpenKeys: openKeys } })
    },
  }

  const siderProps = {
    menu,
    siderFold,
    darkTheme,
    navOpenKeys,
    changeTheme () {
      dispatch({ type: 'app/switchTheme' })
    },
    changeOpenKeys (openKeys) {
      localStorage.setItem(`${prefix}navOpenKeys`, JSON.stringify(openKeys))
      dispatch({ type: 'app/handleNavOpenKeys', payload: { navOpenKeys: openKeys } })
    },
  }

  const breadProps = {
    menu,
  }
  if (openPages && openPages.includes(pathname)) {
    return (
      <div className={styles.layout}>
        {children}
      </div>)
  }
  return (
    <div>
      <Helmet>
        <title>Mobi - Your Money, Anywhere.</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {iconFontJS && <script src={iconFontJS}></script>}
        {iconFontCSS && <link rel="stylesheet" href={iconFontCSS} />}
      </Helmet>
      <IntlProvider locale={i18n.locale} messages={i18n.messages}> 
        <div className={classnames(styles.layout, { [styles.fold]: isNavbar ? false : siderFold }, { [styles.withnavbar]: isNavbar })}>
          {!isNavbar ? <aside className={classnames(styles.sider, { [styles.light]: !darkTheme })}>
            <Sider {...siderProps} />
          </aside> : ''}
          <div className={styles.main}>
            <Header {...headerProps} />
            <div className={styles.container}>
              <div className={styles.content}>
                  {children}
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </IntlProvider>
    </div>
  )
}

App.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  app: PropTypes.object,
  loading: PropTypes.object,
}

export default connect(({ app, loading, i18n }) => ({ app, loading, i18n }))(App)
