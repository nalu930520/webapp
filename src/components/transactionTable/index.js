import React from "react";
import s from "./index.less";
import { Table } from "antd";
import {
  codeTocurrencyCode,
  getcurrencyBycode,
  formatNumber,
  formatCurrency
} from "../../utils";
import { FormattedNumber, FormattedMessage } from "react-intl";
import store from "store";

import converImg from "../../../public/convert@2x.png";
import cardImg from "../../../public/Group-1@2x.png";
import onChain from "../../../public/on-chain@2x.png";
import defaultaAvatar from "../../../public/default_avatar.png";
import mobiRefound from "../../../public/mobi-refund.png";
import defaultTypeImg from "../../../public/TX@2x.png";
import widthdrawTypeImg from "../../../public/icon-history-hyphen@3x.png";
import newOnchain from "../../../public/icon-onchain@2x.png";
import tableNoData from "../../../public/table_no_data.png";
import bigNumber from "bignumber.js";

function TransactionTable({
  transactionList, onrowclick,
  currentCode,
  loading
}) {
  const currentCodeInfo = getcurrencyBycode(currentCode);
  const getTypeImg = record => { 
    let typeImg;
    switch (record.type) {
      case 17:
        typeImg = widthdrawTypeImg;
        break;
      case 4:
        typeImg = mobiRefound;
        break;
      case 11:
      case 12:
        typeImg = converImg;
        break;
      case 3:
        typeImg = defaultTypeImg;
        break;
      case 5:
        typeImg = record.userInfo[0].profile_image_url || defaultaAvatar;
        break;
      case 6:
        typeImg = newOnchain;
        break;
      case 7:
        typeImg = newOnchain;
        break;
      default:
        typeImg = defaultTypeImg;
        break;
    }
    return typeImg;
  };
  const getTypeName = record => {
    let typeName;
    switch (record.type) {
      case 3:
        typeName = <FormattedMessage id="transaction_type_text_3" />;
        break;
      case 4:
        typeName = <FormattedMessage id="transaction_type_text_4" />;
        break;
      case 5:
        typeName = <FormattedMessage id="transaction_type_text_5" />;
        break;
      case 6:
        typeName =
          record.isPayer !== 1 ? (
            <FormattedMessage id="transaction_type_text_6" />
          ) : (
            <FormattedMessage id="transaction_type_text_7" />
          );
        break;
      case 7:
        typeName = <FormattedMessage id="transaction_type_text_6" />;
        break;
      case 11:
        typeName = <FormattedMessage id="transaction_type_text_11" />;
        break;
      case 12:
        typeName = <FormattedMessage id="transaction_type_text_12" />;
        break;
      case 13:
        typeName = <FormattedMessage id="transaction_type_text_13" />;
        break;
      case 14:
        typeName = <FormattedMessage id="transaction_type_text_14" />;
        break;
      case 15:
        typeName = <FormattedMessage id="transaction_type_text_15" />;
        break;
      case 16:
        typeName = <FormattedMessage id="transaction_type_text_16" />;
        break;
      case 17:
        typeName = <FormattedMessage id="transaction_type_text_17" />;
        break;
      case 18:
        typeName = <FormattedMessage id="transaction_type_text_18" />;
        break;
      default:
        typeName = "";
        break;
    }
    return typeName;
  };
  const getOrderUserName = record => {
    const userInfo = record.userInfo[0];
    return userInfo.friend_alias || userInfo.mobi_name || userInfo.mobile;
  };
  const getAccount = record => {
    let account;
    switch (record.type) {
      case 17:
        account = <FormattedMessage id="transaction_type_text_17" />;
      case 4:
        account = <FormattedMessage id="transaction_type_text_4" />;
        break;
      case 11:
      case 12:
        account =
          record.currencyCode !== currentCode
            ? codeTocurrencyCode(record.currencyCode)
            : codeTocurrencyCode(record.feeCurrency);
        break;
      case 5:
        account = getOrderUserName(record);
        break;
      case 3:
        account =
          record.isPayer === 1 ? record.payeeMobiName : record.creatorMobiName;
        break;
      case 6:
        account = record.payeeName;
        break;
      case 7:
        account = "-";
        break;
      default:
        account = "";
    }
    return account;
  };
  const getAmount = record => {
    let amount;
    if (record.type === 6 && record.isPayer) {
      return record.amount + record.fee + record.extraFee;
    }
    switch (record.type) {
      case 11:
      case 12:
        amount =
          currentCode === record.currencyCode
            ? record.amount
            : record.targetAmount;
        break;
      default:
        amount = record.amount;
        break;
    }
    return amount;
  };
  const getBalance = record => {
    if (record.balance === -1) {
      return <FormattedMessage id="transaction_label_pending" />;
    }
    return formatCurrency(
      record.currencyCode !== currentCode
        ? record.targetBalance
        : record.balance,
      currentCode
    );
  };
  const TransactionColumns = [
    {
      title: "",
      dataIndex: "type",
      key: "typeimg",
      width: "10%",
      className: "leftCol",
      render: (text, record) => (
        <span className="tableAvator">
          <img src={getTypeImg(record)} />
        </span>
      )
    },
    {
      title: <FormattedMessage id="mywallets_label_subwallets_date" />,
      dataIndex: "createdAt",
      key: "createdAt",
      width: "10%",
      className: "leftCol",
      render: (text, record) => (
        <span>
          {`${new Date(record.createdAt).getFullYear()}-${
            new Date(record.createdAt).getMonth() + 1 < 10 ? "0" : ""
          }${new Date(record.createdAt).getMonth() + 1}-${
            new Date(record.createdAt).getDate() < 10 ? "0" : ""
          }${new Date(record.createdAt).getDate()}`}
        </span>
      )
    },
    {
      title: <FormattedMessage id="mywallets_label_subwallets_type" />,
      dataIndex: "type",
      key: "type",
      width: "20%",
      className: "leftCol",
      render: (text, record) => <span>{getTypeName(record)}</span>
    },
    {
      title: <FormattedMessage id="nav_footer_label_accounts" />,
      dataIndex: "feeCurrency",
      key: "feeCurrency",
      width: "25%",
      className: "leftCol",
      render: (text, record) => <span>{getAccount(record)}</span>
    },
    {
      title: <FormattedMessage id="mywallets_label_subwallets_amount" />,
      dataIndex: "amount",
      key: "amount",
      width: "20%",
      className: "rightCol",
      render: (text, record) => (
        <span>
          {record.currencyCode !== currentCode
            ? "+"
            : record.isPayer
              ? "-"
              : "+"}{" "}
          {formatCurrency(getAmount(record), currentCode)}{" "}
          {codeTocurrencyCode(currentCode)}
        </span>
      )
    },
    {
      title: <FormattedMessage id="mywallets_label_balance" />,
      dataIndex: "balance",
      key: "balance",
      width: "15%",
      className: "rightCol",
      render: (text, record) => (
        <span>
          {getBalance(record)}{" "}
          {record.balance !== -1 ? codeTocurrencyCode(currentCode) : ""}
        </span>
      )
    }
  ];
  return (
    <Table
      pagination={{ pageSize: 10 }}
      columns={TransactionColumns}
      dataSource={transactionList}
      onRowClick={onrowclick}
      loading={loading}
      locale={{
        emptyText: (
          <div className="table-noData-wraper">
            {loading ? (
              ""
            ) : (
              <span>
                <img src={tableNoData} alt="" />
                <p>
                  <FormattedMessage id="table_empty_no_data" />
                </p>
              </span>
            )}
          </div>
        )
      }}
    />
  );
}

export default TransactionTable;
