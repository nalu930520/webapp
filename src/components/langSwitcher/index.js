import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import s from './index.less'
import { Select } from 'antd'
const LangSwitcher = ({ i18n, changeLanguage }) => {
  const isSelected = locale => locale === i18n.locale;
  const localeName = locale => localeDict[i18n.locale] || locale;
  const localeDict = {
    'zh': '中文',
    'en': 'English',
  };
  const availableLocales = ['zh', 'en']
  return (
    <div className={s.langSwitch}>
      {availableLocales.map(locale => (
        <span className={s.langClickWraper} key={locale}>
          {isSelected(locale) ? (
            <span>{localeDict[locale]}</span>
          ) : (
            <a
              href='#'
              onClick={(e) => {
                changeLanguage(locale);
                e.preventDefault();
              }}
            >{localeDict[locale]}</a>
          )}
          {' '}
        </span>
      ))}
        {/* <Select
          defaultValue={i18n.locale}
          style={{ width: 150, marginTop: 8 }}
          size={'large'}
          onChange={(value) => {
            changeLanguage(value)
           }} >
          <Option value="en">English</Option>
          <Option value="zh">中文</Option>
        </Select> */}
    </div>
  )
}

export default LangSwitcher
