import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import s from './index.less'
import { Select } from 'antd'
const LangSelect = ({ i18n, changeLanguage }) => {
  return (
    <div className={s.langSelectWraper}>
        <Select
          defaultValue={i18n.locale}
          style={{ width: 150, marginTop: 8 }}
          size={'large'}
          onChange={(value) => {
            changeLanguage(value)
           }} >
          <Option value="en">English</Option>
          <Option value="zh">中文</Option>
        </Select>
    </div>
  )
}

export default LangSelect
