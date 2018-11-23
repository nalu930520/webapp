import React from 'react';
import s from './index.less';
import { Table } from 'antd';
import { codeTocurrencyCode, formatNumber, formatCurrency}  from '../../utils';
import { FormattedNumber, FormattedMessage } from 'react-intl';
import tableNoData from '../../../public/table_no_data.png';
import _ from 'lodash';

function WalletsTable ({ walletsList, onRowclick }) {
    const walletsColumns = [
      {
        title: '',
        dataIndex: 'countryimg',
        key: 'country',
        width: '10%',
        className: 'leftCol',
        render: (text, record) => (
          <span className='tableAvator'>
            <img src={record.countryimg} />
          </span>
        ),
      },
      {
        title: <FormattedMessage id="mywallets_label_currency"/>,
        dataIndex: 'countryName',
        key: 'currency',
        width: '70%',
        className: 'leftCol',
      },
      {
        title: <FormattedMessage id="mywallets_label_balance"/>,
        dataIndex: 'balance',
        key: 'balance',
        width: '20%',
        className: 'rightCol',
        render: (text, record) => (
          <span>
            {formatCurrency(record.balance, record.currencyCode)}
            {' '}
            {codeTocurrencyCode(record.currencyCode)}
          </span>
        ),
      },
    ];
  return (
    <Table
      pagination={{ pageSize: 10 }}
      columns={walletsColumns}
      dataSource={walletsList}
      onRowClick={onRowclick}
      locale={{
        emptyText:
          <div className='table-noData-wraper'>
            <img src={tableNoData} alt="" />
            <p><FormattedMessage id='table_empty_no_data' /></p>
          </div>
      }}
    />
  )
}

export default WalletsTable;