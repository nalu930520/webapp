import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Form, Icon, Input, Button, Checkbox, Select, Row, Col } from 'antd'
import { FormattedMessage, IntlProvider } from 'react-intl'
import { classnames } from 'utils'
import LangSelect from '../../components/langSelect'
import LeftImg from '../../../public/register_picture_left.png';
import RightImg from '../../../public/register_picture_right.png';
import { aid } from '../../utils/config'
import styles from './RegisterForm.less'
import { Link } from 'dva/router'
import { authMobile } from '../../services/register'
import uuidv1 from 'uuid/v1'
import QRcode from 'qrcode.react';
import Cookies from 'universal-cookie'
const cookies = new Cookies();
const FormItem = Form.Item
const Option = Select.Option

const hasErrors = (fieldsError) => {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class RegisterForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmDirty: false,
      leftTime: '',
      mobile: '',
      pin: '',
      countryCode: '',
      showCaptcha: false,
      ticket: '',
      randStr: '',
    }
  }

  countDown = () => {
    this.setState({ leftTime: 60 })
    const timer = setInterval(() => {
      if (!this.state.leftTime) {
        clearInterval(timer)
      } else {
        this.setState({ leftTime: this.state.leftTime - 1 })
      }
    }, 1000)
  }

  previousStep = () => {
    const { dispatch } = this.props;
    this.setState({mobile: '', leftTime: 0})
    this.props.form.validateFields();
    dispatch({ type: 'register/nextStep', payload: {step: 0}})
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  retFiledStatus = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'register/retStatus' });
  }

  getCaptcha = () => {
    const { dispatch, register, routing, i18n } = this.props;
    const mobile = this.props.form.getFieldValue('phoneNumber');
    const mobile_country = this.props.form.getFieldValue('countryCode');
    const invite_code = routing.locationBeforeTransitions.query.invite_code;
    const that = this;
    that.props.form.validateFields(['phoneNumber'], (err, value) => {
      if(!err){
        const uuid = uuidv1();
        cookies.set('mobi_device_hash', uuid, { domain: '.mobi.me' });
        cookies.set('mobi_device_hash', uuid, { domain: '.mobiapp.cn' });
        const params = {
          mobile: mobile,
          mobile_country_code:mobile_country,
          device_hash: uuid,
        }
        if(!!invite_code){
          params.invite_code = invite_code
        }
        authMobile(params).then((response) => {
          if(response.ret === 1) {
            dispatch({
              type: 'register/authMobileSuccess',
              payload: {
                mobileStatus: response.set_pin ? 'success' : i18n.messages.register_error_already_register,
              }
            });
            cookies.set('mobi_token', response.token, { domain: '.mobi.me' });
            cookies.set('mobi_token', response.token, { domain: '.mobiapp.cn' });
            if(response.set_pin) {
              if(this.state.showCaptcha) {
                dispatch({ type: 'register/getCaptcha', payload: {aid: aid, ticket: that.state.ticket, rand_str: that.state.randStr} })
                that.countDown();
              } else {
                const captcha1 = new TencentCaptcha(aid, function(res) {
                  // res（未通过验证）= {ret: 1, ticket: null}
                  // res（验证成功） = {ret: 0, ticket: "String", randstr: "String"}
                  if(res.ret === 0){
                    that.setState({showCaptcha: true, ticket: res.ticket, randStr: res.randstr})
                  }
                });
                captcha1.show();
              }
            }
          }
        })
      }
    });
  }

  verifyCaptcha = (rule, value, callback) => {
    const { dispatch } = this.props;
    if(!!value && value.length === 6){
      dispatch({ type: 'register/verifyCaptcha', payload: { verify_code: value } })
      callback();
    }else {
      callback();
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch, register } = this.props;
    const that = this;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err && register.mobileStatus !== 'error' && register.captchaStatus !== 'error') {
        that.setState({mobile: that.props.form.getFieldValue('phoneNumber')})
        that.setState({countryCode: that.props.form.getFieldValue('countryCode')})
        dispatch({ type: 'register/nextStep', payload: { step: 1 } })
      }
    });
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    const { i18n } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback(i18n.messages.login_alert_text_pin_not_match);
    } else {
      callback();
    }
  }

  handleSetPinSubmit = (e) => {
    e.preventDefault();
    const { dispatch, register } = this.props;
    const pin = this.props.form.getFieldValue('password');
    const mobile_country = this.state.countryCode;
    const mobile = this.state.mobile;
    console.log('state:', this.state);
    const that = this;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        dispatch({
          type: 'register/setPin',
          payload: {
            pin: pin
          }
        })
      }else{
        if(register.captchaError === 'error'){
          callback()
        }
      }
    });
  }

  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched, isFieldsTouched } = this.props.form;
    const { dispatch, i18n } = this.props;
    const { countries, step , mobileStatus, captchaStatus, registerLoading } = this.props.register;
    const isPc = document.body.clientWidth > 768;
    const prefixSelector = getFieldDecorator('countryCode',
      { initialValue: 'CN' })(
      <Select
        placeholder=" "
        dropdownClassName={'countyOption'}
        >
        {!!countries
          ? countries.map((country, index) => {
            return (
              <Option value={country.iso2} key={index}>
                <span className="country-name">{i18n.locale === 'en' ? country.name_en : country.name}</span>
                <span className="country-code">+{country.mobile_code}</span>
              </Option>
              )
          })
          : <Option value="" />}

      </Select>,
    );

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
    };

    // Only show error after a field is touched.
   const phoneNumberError = (isFieldTouched('phoneNumber') && getFieldError('phoneNumber')) || mobileStatus;
   const captchaError = (isFieldTouched('captcha') && getFieldError('captcha')) || captchaStatus;
    return(
      <IntlProvider locale={i18n.locale} messages={i18n.messages}>
        <div className={styles.registerContent}>
          <div className={classnames({[styles.registerSuccessBox]: step === 2})} >
            {step === 0 &&
              <Form onSubmit={this.handleSubmit}>
                <h1 className={styles.registerHeader}><FormattedMessage id="register_title_mobi" /></h1>
                <FormItem
                  {...formItemLayout}
                  className={classnames(styles.phoneNumberWrap, { 'acitve': isFieldTouched('phoneNumber')})}
                  hasFeedback
                  validateStatus={(phoneNumberError === 'success' ? 'success' : '') || (phoneNumberError ? 'error' : '')}
                  help={(phoneNumberError === 'success' ? '' : phoneNumberError)}
                  >
                  {getFieldDecorator('phoneNumber', {
                    initialValue: this.state.mobile,
                    rules: [
                      {
                        required: true,
                        message: this.props.i18n.messages.send_error_text_enter_phone_number,
                      },
                      {
                        max: 17,
                        pattern: /^\d{0,17}$/,
                        message: this.props.i18n.messages.send_error_text_invalid_phone_number,
                      },
                      {
                        min: 3,
                        message: this.props.i18n.messages.send_error_text_invalid_phone_number,
                      }
                    ],
                  })(<Input addonBefore={prefixSelector} onChange={this.retFiledStatus} placeholder={this.props.i18n.messages.register_input_placeholder_mobile }/>)}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  className={isFieldTouched('captcha') ? styles.formActive : ''}
                  validateStatus={(captchaError === 'success' ? 'success' : '') || (captchaError ? 'error' : '')}
                  help={captchaError === 'success' ? '' : captchaError}
                >
                  <Row gutter={0}>
                    <Col span={16}>
                      {getFieldDecorator('captcha', {
                        initialValue: this.state.captcha,
                        rules: [
                          { required: true, message: this.props.i18n.messages.register_error_captcha },
                          { max: 6, pattern: /^\d{0,6}$/,  message: this.props.i18n.messages.register_error_captcha },
                          { min: 6, pattern: /^\d{0,6}$/,  message: this.props.i18n.messages.register_error_captcha },
                          { validator: this.verifyCaptcha }
                        ],
                      })(
                        <Input size="large" onChange={this.retFiledStatus} placeholder={this.props.i18n.messages.register_input_placeholder_mobile_captha}/>
                      )}
                    </Col>
                    <Col span={8}>
                      <Button size="large" className={styles.captchaBtn} onClick={this.getCaptcha} disabled={this.state.leftTime > 0}>{this.state.leftTime > 0 ? this.state.leftTime + 'S' : (this.state.leftTime === '' ? this.props.i18n.messages.register_button_mobile_captcha : this.props.i18n.messages.register_button_resend_captcha )} </Button>
                    </Col>
                  </Row>
                </FormItem>
                <FormItem>
                 <Button
                   type="primary"
                   htmlType="submit"
                   className={styles.loginButton}
                   disabled={hasErrors(getFieldsError()) || captchaStatus !== 'success' || !(mobileStatus === '' || mobileStatus === 'success')}
                   >
                   <FormattedMessage id="register_next_step" />
                 </Button>
               </FormItem>
               <div className={styles.registerText}><FormattedMessage id="register_text_had_mobi_account" /><a href="/login"><FormattedMessage id="register_link_login"/></a></div>
              </Form>
            }
            {step === 1 &&
              <Form onSubmit={this.handleSetPinSubmit}>
                <h1 className={styles.registerHeader}><FormattedMessage id="register_set_pin_code" /></h1>
                <FormItem
                  {...formItemLayout}
                  className={isFieldTouched('password') ? styles.formActive : ''}
                  hasFeedback
                >
                  {getFieldDecorator('password', {
                    rules: [
                      {required: true, message: this.props.i18n.messages.register_error_password_required},
                      { min: 6,  message: this.props.i18n.messages.register_error_password_required },
                      { len: 6, pattern: /^\d{0,6}$/,  message: this.props.i18n.messages.register_error_password_required },
                    ],
                  })(
                    <Input type="password" placeholder={this.props.i18n.messages.register_input_pin_code}/>
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  className={isFieldTouched('confirm') ? styles.formActive : ''}
                  hasFeedback
                >
                  {getFieldDecorator('confirm', {
                    rules: [
                      {required: true, message: this.props.i18n.messages.register_input_pin_code},
                      {
                        validator: this.compareToFirstPassword,
                      }
                    ],
                  })(
                    <Input type="password" onBlur={this.handleConfirmBlur} placeholder={this.props.i18n.messages.register_input_pin_code}/>
                  )}
                </FormItem>
                <FormItem>
                 <Button type="primary" htmlType="submit" className={styles.loginButton} disabled={hasErrors(getFieldsError())} loading={registerLoading}>
                   <FormattedMessage id="register_button_register"/>
                 </Button>
               </FormItem>
               <div className={styles.registerText}><FormattedMessage id="register_does_not_use_this_account" /><a onClick={this.previousStep}><FormattedMessage id="register_previous_step" /></a></div>
              </Form>
            }
            {step === 2 &&
              <Form>
                <h1 className={styles.registerHeader}>
                  <FormattedMessage id="register_title_success" />
                </h1>
                <div className={styles.loginBox}>
                  {isPc &&
                    <div>
                      <div><h3><FormattedMessage id="register_text_download_app" /></h3></div>
                      <div className={styles.qrcodeWraper}>
                        <QRcode value="www.mobi.me" size={200} level={'M'} />
                      </div>
                    </div>
                  }
                  {!isPc &&
                    <div>
                      <svg className={styles.qrcodeWraper} width="80px" height="80px" viewBox="0 0 80 80" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                        <title>app icon</title>
                        <desc>Created with Sketch.</desc>
                        <defs></defs>
                        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fillRule="evenodd">
                            <g id="mobile_success" transform="translate(-148.000000, -260.000000)" fill="#214EA2">
                                <g id="card" transform="translate(10.000000, 111.000000)">
                                    <g id="app-icon" transform="translate(138.000000, 149.000000)">
                                        <path d="M14.5454545,0 L65.4545455,0 C73.4877782,-1.47568091e-15 80,6.51222182 80,14.5454545 L80,65.4545455 C80,73.4877782 73.4877782,80 65.4545455,80 L14.5454545,80 C6.51222182,80 9.83787274e-16,73.4877782 0,65.4545455 L0,14.5454545 C-9.83787274e-16,6.51222182 6.51222182,1.47568091e-15 14.5454545,0 Z M26.3917526,24.8574521 C26.3917526,24.8574521 28.9649485,29.7229147 30.5083568,32.3283591 C32.2477939,35.2641542 35.6687506,39.9998361 35.6687506,39.9998361 C35.6687506,39.9998361 32.2477939,44.7355181 30.5083568,47.6716409 C28.9649485,50.2767576 26.3917526,55.1425479 26.3917526,55.1425479 C26.3917526,55.1425479 27.1752312,57.4130534 29.1056055,60.9459704 C31.0359797,64.4785598 33.3552292,66.8041237 33.3552292,66.8041237 C33.3552292,66.8041237 40.1945967,58.0091922 44.1829549,53.3826439 C48.1716313,48.7560957 56.0824742,39.9998361 56.0824742,39.9998361 C56.0824742,39.9998361 48.1716313,31.2435766 44.1829549,26.6173561 C40.1945967,21.9904801 33.3552292,13.1958763 33.3552292,13.1958763 C33.3552292,13.1958763 31.0359797,15.521768 29.1056055,19.0540296 C27.1752312,22.5866189 26.3917526,24.8574521 26.3917526,24.8574521 Z" id="Combined-Shape"></path>
                                    </g>
                                </g>
                            </g>
                        </g>
                      </svg>
                      <a href="https://mobi.me" className={styles.loginButton}>
                        <Button type="primary" className={styles.loginButton}>
                          <FormattedMessage id="register_download_btn"/>
                        </Button>
                      </a>
                    </div>
                  }
                  <div className={styles.registerText}><FormattedMessage id="register_text_had_mobi_account" /><a href="/login"><FormattedMessage id="register_link_login"/></a></div>
                </div>
              </Form>
            }
          </div>
        </div>
      </IntlProvider>
    )
  }
}

RegisterForm.propTypes = {
  form: PropTypes.object,
  routing: PropTypes.object,
  register: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ routing ,dispatch, register, i18n }) => ({ routing, dispatch, register, i18n }))(Form.create()(RegisterForm))
