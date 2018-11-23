import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Card } from 'antd'
import styles from './index.less'
import { color } from 'utils'
import TotalBalance from '../../components/totalBalance';
import WalletTable from '../../components/walletsTable';
import { routerRedux } from 'dva/router'
import Loader from '../../components/Loader'
import { IntlProvider } from 'react-intl'
const bodyStyle = {
  bodyStyle: {
    height: 432,
    background: '#fff',
  },
}

function MyWallets ({ dispatch, myWallets, app, i18n }) {
  const { wallets, totalBalance, loading } = myWallets
  const rowClick = (record) => {
    dispatch(routerRedux.push(`/myWallets/transaction/${record.currencyCode}`))
  }

  return (
   <IntlProvider locale={i18n.locale} messages={i18n.messages}>
    <Row gutter={24}>
      <Col>
       <Card bordered={false}>
         <TotalBalance totalBalance={totalBalance}
           sendClick={() => dispatch(routerRedux.push('/sendreceive?status=1'))}
           receiveClick={() => dispatch(routerRedux.push('/sendreceive?status=2'))}
         />
       </Card>
       <Card bordered={false} bodyStyle={{ padding: 10 }} >
         <WalletTable walletsList={wallets} onRowclick={rowClick}/>
       </Card>
      </Col>
      <Loader spinning={ loading }/>
    </Row>
    </IntlProvider>
  )
}

MyWallets.propTypes = {
  myWallets: PropTypes.object,
}

export default connect(({ myWallets, i18n }) => ({ myWallets, i18n }))(MyWallets)
