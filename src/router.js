import React from 'react'
import PropTypes from 'prop-types'
import { Router } from 'dva/router'
import App from './routes/app'
import AgreeTos from './routes/agree-tos'

const registerModel = (app, model) => {
  if (!(app._models.filter(m => m.namespace === model.namespace).length === 1)) {
    app.model(model)
  }
}

const Routers = function ({ history, app }) {
  const routes = [
    {
      path: '/agree-tos',
      component: AgreeTos,
      getIndexRoute (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/AgreeTos'))
        }, 'agreeTos')
      },
    },
    {
      path: 'register',
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/register'))
          cb(null, require('./routes/register/'))
        }, 'register')
      },
    },
    {
      path: '/',
      component: App,
      getIndexRoute (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/myWallets'))
          cb(null, { component: require('./routes/myWallets/') })
        }, 'myWallets')
      },
      childRoutes: [
        {
          path: '/myWallets',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/myWallets'))
              cb(null, require('./routes/myWallets/'))
            }, 'myWallets')
          },
        }, {
          path: 'myWallets/transaction/:code',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/transaction'))
              cb(null, require('./routes/transaction'))
            }, 'transaction')
          },
        }, {
          path: 'login',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/login'))
              cb(null, require('./routes/login/'))
            }, 'login')
          },
        }, {
          path: 'sendreceive',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sendreceive'))
              cb(null, require('./routes/sendreceive/'))
            }, 'sendreceive')
          },
        },
        {
          path: 'sendreceive/sendConfirm',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sendConfirm'))
              cb(null, require('./routes/sendConfirm/'))
            }, 'sendConfirm')
          }
        },
        {
          path: 'sendreceive/sendSuccess/:SNcode',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/sendSuccess'))
              cb(null, require('./routes/sendSuccess/'))
            }, 'sendSuccess')
          },
        },
        {
          path: '*',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/error/'))
            }, 'error')
          },
        },
      ],
    },
  ]

  return <Router history={history} routes={routes} />
}

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
}

export default Routers
