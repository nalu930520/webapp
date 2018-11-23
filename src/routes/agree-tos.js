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

const argeetos = ({  }) => {

  return (
    <div>
      <Helmet>
        <title>Mobi - Your Money, Anywhere.</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {iconFontJS && <script src={iconFontJS}></script>}
        {iconFontCSS && <link rel="stylesheet" href={iconFontCSS} />}
      </Helmet>
      <div>loading...</div>
    </div>
  )
}


export default connect(argeetos)
