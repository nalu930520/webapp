import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Row, Form, Input } from 'antd'
import { config } from 'utils'
import styles from './index.less'
import QRCode from 'qrcode.react'
import QRscan from '../../components/QRscan'
import LangSelect from '../../components/langSelect'
import LangSwitcher from '../../components/langSwitcher'
import logoIcon from '../../../public/logo_white.png'
import { FormattedMessage, IntlProvider } from 'react-intl'
const FormItem = Form.Item


class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showRefresh: false,
    }
  }
  componentWillReceiveProps(nextProps) {
    const nextQrcodeUrl = nextProps.login.qrcodeUrl;
    if (nextQrcodeUrl) {
      setTimeout(() =>{
        this.setState({
          showRefresh: true,
        })
      }, nextProps.login.expire * 1000)
    }
  }
  render() {
    const { loginLoading, qrcodeUrl, userInfo } = this.props.login
    const { dispatch, i18n } = this.props;
    return(
      <IntlProvider locale={i18n.locale} messages={i18n.messages}>
        <div className={styles.loginContent}>
          <div className={styles.loginHeader}>
            <a href="https://mobi.me" target="_blank">
              <img src={logoIcon} />
            </a>
          </div>
          <QRscan
            userInfo={userInfo} 
            qrcodeUrl={qrcodeUrl}
            refershQrcode={() => {
              dispatch({ type: 'login/getHashcode' })
              this.setState({
                showRefresh: false,
              })
            }}
            showRefresh={this.state.showRefresh}
          />
          <div className={styles.bottomWraper}>
            <LangSwitcher
              i18n={i18n}
              changeLanguage={(lang) => {
                dispatch({ type: 'i18n/setLocale', locale: lang })
              }}
             />
            <FormattedMessage id="general_footer_text_copyright"/>
          </div>
          <div className={styles.topTrangle}></div>
          <div className={styles.bottomTrangle}></div>
        </div>
      </IntlProvider>
    )
  }
}

Login.propTypes = {
  form: PropTypes.object,
  login: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ dispatch, login, i18n }) => ({ dispatch, login, i18n }))(Login)
 