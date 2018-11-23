import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Card, Tooltip, Radio, Button,
  Form, Input, InputNumber, Select, Tabs, message } from 'antd'
import WAValidator from 'wallet-address-validator';
import problemIcon from '../../../public/problemIcon.png';
import bitcoinIcon from '../../../public/bitcoin_address.png';
import ContactIcon from '../../../public/mobi_contacts.jpg';
import mobileNumber from '../../../public/mobile_number.png';
import ethCarcIcon from '../../../public/ethCarcIcon.jpg';
import SendCard from '../../components/sendCard/';
import ContactCard from '../../components/contactCard/';
import { codeTocurrencyCode, getcurrencyBycode, formatNumber, amountFormat, sendNumDec, formatCurrency } from '../../utils';
import store from 'store';
import Loader from '../../components/Loader';
import ReceiveQr from '../../components/receive'
import { FormattedMessage, IntlProvider } from 'react-intl';
import { apiURL } from '../../utils/config.js'
import _ from 'lodash';
import s from './index.less'
import ICAP from 'ethereumjs-icap';
import bg from 'bignumber.js';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item
const Option = Select.Option;
const Search = Input.Search;
const InputGroup = Input.Group;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
    md: { span: 4 },
    lg: { span: 3 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
    md: { span: 10 },
    lg: { span: 8 }
  },
};
const bitcoinItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
    md: { span: 4 },
    lg: { span: 3 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
    md: { span: 10 },
    lg: { span: 8 }
  }
};
const textareaLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
    md: { span: 4 },
    lg: { span: 3 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
    md: { span: 10 },
    lg: { span: 8 }
  },
};


class Sendreceive extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      sendType: '1',
      receiveType: 'btc',
      searchFriendList: this.props.sendreceive.userFriendList,
      isShowDialog: false,
      submitError: '',
      amoutValue: null,
      searchEnd: true,
    }
  }
  searchUserFriend(value, list){
    if(!value) {
      this.setState({
        searchFriendList: this.props.sendreceive.userFriendList,
      })
      return
    }
    const userFriendList = value === ''
      ? list
      : list.filter((userItem) => isNaN(value)
        ? (
          userItem.friend_alias.indexOf(value) >= 0 ||
          userItem.mobi_name.indexOf(value) >= 0 ||
          userItem.mobi_name.toLowerCase().indexOf(value.toLowerCase()) >= 0
          )
        : userItem.mobile.indexOf(value) >= 0);
    this.setState({
      searchFriendList: userFriendList,
      searchEnd: false,
    });
  }
  componentWillReceiveProps(nextProps) {
    const userlistFriend = nextProps.sendreceive.userFriendList
    if (this.state.searchEnd && userlistFriend && userlistFriend.length) {
      this.setState({
        searchFriendList: userlistFriend,
        searchEnd: true,
      })
    }
  }
  getSecondStep(sendType) {
    const { getFieldDecorator } = this.props.form;
    const { userFriendList } = this.props.sendreceive;
    const lang = this.props.i18n.locale;
    const countrys = store.get('countrys')
    const prefixSelector = getFieldDecorator('countryCode',
      { initialValue: 'CN +86' })(
      <Select
        style={{ width: 106 }}
        showSearch
        dropdownClassName={'countyOption'}
      >
        {countrys
          ? countrys.map((country, index) => {
            return (
              <Option value={`${country.iso2} +${country.mobile_code}`}>
                <img src={country.image_url} className={s.optionImg} />
                <span className="country-name">{lang === 'en' ? country.name_en : country.name}</span>
                <span className="country-code">+{country.mobile_code}</span>
              </Option>
              )
          })
          : <Option value="" />}

      </Select>,
    );
    switch (sendType) {
      case '1':
        return (
          <div>
            <div className={s.stepTitle}>
                <FormattedMessage id="send_label_step_2_select_contact" />
                <Search
                  size={'large'}
                  placeholder={this.props.i18n.messages.send_label_search_contact}
                  style={{ width: 200 }}
                  onChange={event => this.searchUserFriend(event.target.value, this.props.sendreceive.userFriendList)}
                />
            </div>
            <div id="radio-group-wrap" className={s.contactWraper}>
              {getFieldDecorator('contactGroup', {})(
                <RadioGroup>
                  { this.state.searchFriendList ? this.state.searchFriendList.map(data => (
                        <RadioButton value={`${data.country_code} ${data.mobile}`} key={data.mobile}>
                          <ContactCard
                            contactAvatar={data.profile_image_url}
                            contactName={data.friend_alias || data.mobi_name}
                            contactMobile={`+${data.mobileCode} ${data.mobile}`}
                          />
                        </RadioButton>
                        ))
                  : <span style={{display: 'inline-block', fontSize: '24px', margin: '0 auto'}}><FormattedMessage id="send_text_no_search_result" /></span>}
                </RadioGroup>,
                )}
            </div>
          </div>
        )
      case '2':
        return (
          <div>
            <div className={s.stepTitle}>
              <FormattedMessage id="send_label_step_2_enter_phone_number" />
            </div>
            <div className={s.phoneNumberWrap}>
              <FormItem {...formItemLayout} label={<FormattedMessage id="send_label_phone_number" />}>

                {getFieldDecorator('phoneNumber', {
                  rules: [
                    {
                      max: 17,
                      pattern: /^\d{0,17}$/,
                      message: this.props.i18n.messages.send_error_text_invalid_phone_number,
                    },
                    {
                      min: 3,
                      message: this.props.i18n.messages.send_error_text_invalid_phone_number,
                    },
                    {
                      required: true,
                      message: this.props.i18n.messages.send_error_text_enter_phone_number,
                    },
                  ],
                })(<Input addonBefore={prefixSelector} />)}
              </FormItem>
            </div>
          </div>
        )
      case '3':
        const { cryptocurrencys } = this.props.sendreceive
        const needTagCurrencys = ['xrp', 'eos']
        return (
          <div>
            <div className={s.stepTitle}>
              <FormattedMessage id="send_label_step_2_enter_crypto_address" />
            </div>
            <FormItem
              {...bitcoinItemLayout}
              label={<FormattedMessage id="send_label_cyptocurrency" />}
              hasFeedback
              required
            >
              {getFieldDecorator('cryptocurrency', {
                  initialValue: 'btc'
                })(
                <Select
                  dropdownMatchSelectWidth
                  onChange = {() => {
                    const form = this.props.form
                    form.resetFields()
                  }}
                >
                  {cryptocurrencys ? cryptocurrencys.map(cryptocurrency => {
                    return (
                    <Option value={cryptocurrency.currencyCode}>
                      <img src={cryptocurrency.countryimg} className={s.optionImg} style={{ float: 'left' }} />
                      <span style={{ float: 'left', lineHeight: '24px' }}><FormattedMessage id={cryptocurrency.currencyCode.toUpperCase()}/></span>
                      <span className={s.myWallet}>{ formatCurrency(cryptocurrency.balance, cryptocurrency.currencyCode) }<span className={s.walletCodeSpan}>{codeTocurrencyCode(cryptocurrency.currencyCode)}</span></span>
                    </Option>)
                  }): (
                    <Option value="">
                      none
                    </Option>
                  )}
                </Select>
                )}
            </FormItem>
            <FormItem
              {...bitcoinItemLayout}
              label={<FormattedMessage id="send_label_address" />}
              hasFeedback
              required
            >
              {getFieldDecorator('cryptoAddress', {
                rules: [
                  // {
                  //   validator: this.valAddress,
                  // },
                ],
              })(<Input size={'large'} />)}
            </FormItem>
            {needTagCurrencys.indexOf(this.props.form.getFieldValue('cryptocurrency')) > -1 ? (
              <FormItem
                {...bitcoinItemLayout}
                label={this.props.form.getFieldValue('cryptocurrency') === 'xrp' ? 'Tag: ' : 'Memo'}
              >
                {getFieldDecorator('sendTag', {
                  rules: [
                    // {
                    //   required: true,
                    //   message: this.props.i18n.messages.send_error_text_enter_tag
                    // }
                  ]
                })(<Input size={'large'} />)}
              </FormItem>
            ) : '' }
          </div>
        )
    }
  }
  valAddress = (rule, value, callback) => {

    const form = this.props.form;
    let selectCurrency = form.getFieldValue('cryptocurrency');
    const isERC20 = getcurrencyBycode(selectCurrency).is_erc20_token
    if (!value) {
      callback(this.props.i18n.messages.send_error_text_enter_address);
    }
    if (selectCurrency === 'bcc') {
      selectCurrency = 'bch';
    }
    if (selectCurrency === 'usdt') {
      // usdt 的地址效验和 btc 一样
      selectCurrency = 'btc'
    }
    if (selectCurrency === 'eth' || isERC20) {
      if (!/^(0x){0,1}[0-9a-fA-F]{40}$/.test(value)) {
        callback(this.props.i18n.messages.send_error_text_invalid_address);
        return;
      }
    } else {
      if (!WAValidator.validate(value, selectCurrency.toUpperCase(), 'both')) {
        callback(this.props.i18n.messages.send_error_text_invalid_address);
       }
    }
    callback();
  };

  handleSubmit = (e) => {
    const { sendError } = this.props.sendreceive
    const { submitError } = this.state
    const dec = (currency) => getcurrencyBycode(currency).decimal_place
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      values.amount = values.amount.replace(/,/g, '')
      if (
        this.state.sendType === '1' &&
        !values.contactGroup
      ) {
        message.error(this.props.i18n.messages.send_error_text_select_contact);
        return;
      }
      if (!err) {
        let subObj = {}
        const sendType = this.state.sendType;
        const { dispatch } = this.props;
        switch(sendType) {
          case '1':
            subObj = {
              currency: values.currency.split(' ')[0],
              amount: sendNumDec(values.amount, dec(values.currency.split(' ')[0])),
              payee: values.contactGroup.split(' ')[1],
              mobileCountryCode: values.contactGroup.split(' ')[0],
              description: values.message || '',
            }
            break;
          case '2':
            subObj = {
              currency: values.currency.split(' ')[0],
              amount: sendNumDec(values.amount, dec(values.currency.split(' ')[0])),
              payee: values.phoneNumber,
              mobileCountryCode: values.countryCode.split(' ')[0],
              description: values.message || '',
            }
            break;
          case '3':
            subObj = {
              currency: values.cryptocurrency,
              payee: values.sendTag ? `${values.cryptoAddress}-${values.sendTag}` : values.cryptoAddress,
              amount: sendNumDec(values.amount, dec(values.cryptocurrency)),
              description: values.message || '',
            }
            break;
          default:
            return
        }
        dispatch({ type: 'sendreceive/subSend', payload: subObj })
      }
    });
  };
  getReceiveAddress(type) {
    const { cryptocurrencys } = this.props.sendreceive
    if(!cryptocurrencys.length) {
      return <div>Loading</div>
    }
    const getReceiveInfo = (type) => cryptocurrencys.find(cryptocurrency => cryptocurrency.currencyCode === type)
    const receiveInfo = getReceiveInfo(type)
    const tag = receiveInfo.tag || ''
    return (
      <ReceiveQr
        qrcodeString={receiveInfo.addrQRCode}
        i18n={this.props.i18n}
        address={receiveInfo.address} 
        tag={tag}
        currencyCode={receiveInfo.currencyCode}
      />
    )
  }

  receiveQRcodeOnchange(value) {
    const { dispatch } = this.props
    dispatch({ type: 'sendreceive/getAddressByCode', payload: value })
  }

  render () {
    let {
      btcAdress,
      qrcodeString,
      resultPage,
      showReceive,
      loading,
      transactionDetail,
      cryptocurrencys,
      selectedCrypto,
      walletsInfo
    } = this.props.sendreceive;
    const i18n = this.props.i18n;
    const { getFieldDecorator } = this.props.form;
    const { dispatch } = this.props;
    const { sendType } = this.state;
    return (
      <IntlProvider locale={i18n.locale} messages={i18n.messages}>
        <Row gutter={24}>
          <Col>
          <Card bordered={false} bodyStyle={{ padding: 10 }} >
              <Tabs defaultActiveKey={showReceive || "1"}>
                  <TabPane tab={<FormattedMessage id="general_button_send" />} key="1" className={s.tabContent}>
                      <div>
                        <div className={s.stepTitle}>
                          <FormattedMessage id="send_label_step_1" />
                        </div>
                        <div className={s.cardContent}>
                          <RadioGroup
                            onChange={e => {
                              this.props.form.resetFields()
                              this.setState({ sendType: e.target.value })
                            }}
                            defaultValue="1"
                          >
                            <RadioButton value="1">
                              <SendCard
                                cardIcon={ContactIcon}
                                cardDes={<FormattedMessage id="send_label_step_1_mobi_contact" />}
                                selected
                              />
                            </RadioButton>
                            <RadioButton value="2">
                              <SendCard
                                cardIcon={mobileNumber}
                                cardDes={<FormattedMessage id="send_label_step_1_phone_number" />}
                              />
                            </RadioButton>
                            <RadioButton value="3">
                              <SendCard
                                cardIcon={bitcoinIcon}
                                cardDes={<FormattedMessage id="send_label_step_1_crypto_address" />}
                              />
                            </RadioButton>
                          </RadioGroup>
                        </div>
                        <hr />
                        <Form onSubmit={this.handleSubmit}>
                        {this.getSecondStep(sendType)}
                        <hr />
                        <div className={s.stepTitle}>
                          <FormattedMessage id="send_label_step_3" />
                        </div>
                          {(this.state.sendType !== '3' && this.state.sendType !== '4')
                              ? <FormItem {...formItemLayout} label={<FormattedMessage id="send_label_currency" />}>
                                {getFieldDecorator('currency', {
                                  rules: [
                                    {
                                      required: true,
                                      message: 'Please select your currency code!',
                                    },
                                  ],
                                  initialValue: walletsInfo.length ? `${walletsInfo[0].currencyCode} ${walletsInfo[0].countryName}`: '',
                                })(
                              <Select
                                showSearch
                                placeholder="Select a currency"
                                dropdownMatchSelectWidth
                                onSelect={(value, option) => {
                                  const currencyCode = value.split(' ')[0]
                                  this.setState({
                                    selectedCode: codeTocurrencyCode(currencyCode)
                                  })
                                }}
                                filterOption={(input, option) => {
                                  if (option.props.value.indexOf('select-text-span') >= 0) return false;
                                  return option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                                }}
                                hasFeedback
                              >
                                {/* 约定使用 value=select-text-span 来在Select中显示文本 */}
                                <Option value="select-text-span-1" style={{ cursor: 'auto' }} disabled>
                                  <span className={s.currencyTitle}>My Wallet</span>
                                </Option>
                                {
                                  (() => {
                                    if (walletsInfo && walletsInfo.length) {
                                      return walletsInfo.map(wallet => {
                                        const code = codeTocurrencyCode(wallet.currencyCode);
                                        return (
                                          <Option value={`${wallet.currencyCode} ${wallet.countryName}`} key={code}>
                                            <img src={wallet.countryimg} className={s.optionImg} style={{ float: 'left' }} />
                                            <span style={{ float: 'left', lineHeight: '24px' }}>{wallet.countryName}</span>
                                            <span className={s.myWallet}>{ formatCurrency(wallet.balance, wallet.currencyCode) }<span className={s.walletCodeSpan}>{code}</span></span>
                                          </Option>
                                        );
                                      })
                                    }

                                    return (
                                      <Option value="select-text-span-2" style={{ cursor: 'auto', textAlign: 'center' }} disabled>
                                        None
                                      </Option>
                                    );
                                  })()
                                }
                              </Select>,
                                  )}
                              </FormItem>
                              : ''}
                              <FormItem label={<FormattedMessage id="send_label_amount" />} {...formItemLayout} hasFeedback >
                                {' '}
                                {getFieldDecorator('amount', {
                                  normalize: (value, prevValue) => {
                                    if(!value) return
                                    if (!prevValue) {
                                      prevValue = '';
                                    }
                                    if (value.indexOf(',') >= 0) {
                                      value = value.replace(/,/g, '')
                                    }
                                    if (prevValue.indexOf(',') >= 0) {
                                      prevValue = prevValue.replace(/,/g, '')
                                    }
                                    const form = this.props.form;
                                    const currency = form.getFieldValue('currency') ? form.getFieldValue('currency').split(' ')[0] : this.state.sendType === '3' ? this.props.form.getFieldValue('cryptocurrency') : ''
                                    const dec = getcurrencyBycode(currency).client_display_decimal_place
                                    const regStr = dec ? `(^[1-9][0-9]*\\.?(\\d{0,${dec}})?$)|(^0\\.?(\\d{0,${dec}})?$)`
                                      : '(^[1-9][0-9]*$)'
                                    const reg = new RegExp(regStr)
                                    if (value && !reg.test(value)) {
                                      return amountFormat(prevValue, dec);
                                    }
                                    if (`${value}`.length > 12) {
                                      return amountFormat(prevValue, dec);
                                    }
                                    return amountFormat(value, dec);
                                  },
                                  rules: [
                                    {
                                      required: true,
                                      message: this.props.i18n.messages.send_error_text_invalid_amount,
                                    },
                                  ],
                                })(
                                  <Input
                                    style={{ width: '100%' }}
                                    size={'large'}
                                  />,
                                  )}
                              </FormItem>
                              { this.state.sendType !== '3' && this.state.sendType !== '4' ? (
                                <FormItem label={<FormattedMessage id="send_label_message" />} {...textareaLayout} hasFeedback>
                                  {getFieldDecorator('message', {
                                    rules: [
                                        { max: 150, message: this.props.i18n.messages.send_error_text_message_exceed },
                                      {
                                        required: false,
                                        message: 'Please input your message!',
                                      },
                                    ],
                                  })(<Input type="textarea" rows={4} />)}
                                </FormItem>
                              ) : ''}
                              <FormItem wrapperCol={{ offset: 3 }}>
                                <Button type="primary" htmlType="submit" size="large">
                                  <FormattedMessage id="send_button_next" />
                                </Button>
                              </FormItem>
                        </Form>
                      </div>
                  </TabPane>
                  <TabPane tab={<FormattedMessage id="general_button_receive" />} key="2" className={s.tabContent}>
                    <h4 className={s.titleName}>
                      <FormattedMessage id="receive_label_address" />
                      <Tooltip
                        placement="topLeft"
                        title={<FormattedMessage id="receive_text_tooltip" />}
                      >
                        <span>
                          {' '}
                          <img className={s.problemIcon} src={problemIcon} alt="" />
                        </span>
                      </Tooltip>
                    </h4>
                      <div className={s.cardContent}>
                        <Select
                          style={{ width: '300px' }}
                          size={'large'}
                          defaultValue='btc'
                          showSearch
                          dropdownMatchSelectWidth
                          onSelect= {this.receiveQRcodeOnchange.bind(this)}
                        >
                          {cryptocurrencys ? cryptocurrencys.map(cryptocurrency => {
                            return (
                            <Option value={cryptocurrency.currencyCode}>
                              <img src={cryptocurrency.countryimg} className={s.optionImg} style={{ float: 'left' }} />
                              <span style={{ float: 'left', lineHeight: '24px' }}><FormattedMessage id={cryptocurrency.currencyCode.toUpperCase()}/></span>
                            </Option>)
                          }): (
                            <Option value="">
                              none
                            </Option>
                          )}
                        </Select>
                      </div>
                      {this.getReceiveAddress(selectedCrypto)}
                  </TabPane>
              </Tabs>
          </Card>
          </Col>
          <Loader spinning={ loading }/>
        </Row>
      </IntlProvider>
    )
  }
}

export default connect(({ sendreceive, myWallets, i18n }) => ({ sendreceive, myWallets, i18n }))(Form.create()(Sendreceive))
