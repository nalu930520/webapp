import './index.html'
import 'babel-polyfill'
import 'url-search-params-polyfill'
import dva from 'dva'
import createLoading from 'dva-loading'
import { browserHistory } from 'dva/router'
import { message } from 'antd'
import { IntlProvider, addLocaleData, injectIntl } from 'react-intl';
import en from  'react-intl/locale-data/en';
import 'intl';
import * as Ii8n from './i18n';
import {CHINESE, ENGLISH} from './utils/constant';

addLocaleData(Ii8n[CHINESE]);
addLocaleData(Ii8n[ENGLISH]);

// 1. Initialize
const app = dva({
  history: browserHistory,
  onError (error) {
    console.log(error)
    message.error(error.message)
  },
})

// 2. Model
app.model(require('./models/app'))
app.model(require('./models/i18n'));

// 3. Router
app.router(require('./router'))

const App = app.start('#root');


