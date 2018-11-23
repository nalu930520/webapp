import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Card, Spin } from 'antd'
import styles from './index.less'
import TotalBalance from '../../components/totalBalance';
import TransactionTable from '../../components/transactionTable';
import TransactionModal from '../../components/transactionModal';
import Loader from '../../components/Loader';
import { IntlProvider }  from 'react-intl'
import store from 'store';
function Transaction ({ dispatch, myWallets, transaction, i18n }) {
  const { newTradeList, showDetail, record, isLoading, currencyInfo } = transaction;
  const clickDetail = (record) => {
    dispatch({ type: 'transaction/showRecordDetail', payload: record })
    dispatch({ type: 'transaction/displayDialog' })
  }
  return (
    <IntlProvider locale={i18n.locale} messages={i18n.messages}>
      <Row gutter={24}>
        <Col>
        <Card bordered={false}>
          <TotalBalance walletInfo={currencyInfo}  totalBalance={currencyInfo.balance}/>
        </Card>
        <Card bordered={false} bodyStyle={{ padding: 10, marginTop: '15px' }} >
          <TransactionTable
            transactionList={isLoading ? null : newTradeList}
            currentCode={currencyInfo.currencyCode}
            onrowclick={clickDetail}
            loading={isLoading}
          />
        </Card>
        {showDetail ?
          (<TransactionModal
              record={record}
              currentCode={currencyInfo.currencyCode}
              onclose={() => { dispatch({ type: 'transaction/displayDialog' }) }}
            />)
          : ''}
        </Col>
        <Loader spinning={ isLoading }/>
      </Row>
    </IntlProvider>
  )
}

export default connect(({ myWallets, transaction, i18n }) => ({ myWallets, transaction, i18n }))(Transaction)
