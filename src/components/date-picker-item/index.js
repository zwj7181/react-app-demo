/*
 * @Author: ZHONG JUN
 * @Date: 2020-05-23 20:57:32
 * @Description: 针对date-picker的list.item自定义
 */ 

import React from 'react'
import classNames from 'classnames'
import styles from "./index.module.scss";

export default function DatePickerItem({
  onClick,
  required,
  children,
  extra,
  error,
  onErrorClick,
}) {
  return (
    <div
      className={classNames(
        "am-list-item",
        "am-input-item",
        "am-list-item-middle",
        {
          "am-input-error": error,
        }
      )}
    >
      <div className="am-list-line">
        <div className="am-input-label">
          {required ? <i className={styles.required}>*</i> : null}
          {children}
        </div>
        <div
          className={classNames("am-input-control", styles.text)}
          style={{
            color: extra.includes("请") ? "#bbb" : "#333",
          }}
          onClick={onClick}
        >
          {extra}
        </div>
        {error ? (
          <div className="am-input-error-extra" onClick={onErrorClick} />
        ) : null}
      </div>
    </div>
  );
}
