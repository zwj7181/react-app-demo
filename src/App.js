import React, { useState, useEffect } from 'react';

import { DatePicker, List, Button, InputItem, WhiteSpace, WingBlank } from 'antd-mobile';
import { createForm } from 'rc-form';
import QRCode from 'qrcode.react';
import DatePickerItem from './components/date-picker-item';
import ModalButton from './components/modal-button';
import * as utils from './utils';

import styles from './App.module.scss';

const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);

function App({ form: { getFieldProps, getFieldError, validateFields, setFieldsValue } }) {
  const [values, setValues] = useState('')
  // 方便测试
  useEffect(() => {
    setFieldsValue({
      outpatientNO: "88888888",
      name: "李师师",
      idNO: "320205199603075967",
      dob: now,
      lmp: now,
      gravidity: 2,
      parity: 1,
      telephone: "13657721210",
    });
  }, [])
  const onSubmit = () => {
    validateFields((error, { outpatientNO, name, idNO, dob, lmp, gravidity, parity, telephone }) => {
      if (error) {
        return;
      }
      const val = {
        outpatientNO,
        name, 
        idNO,
        dob: utils.formatDate(dob),
        lmp: utils.formatDate(lmp),
        gravidity, 
        parity, 
        telephone
      };
      const valueStr = Object.values(val).join('#');
      const qrcodeValue = `${"Z系统ID*J"}#${valueStr}`;
      setValues(qrcodeValue);
      console.log(val, qrcodeValue);
    });
  };
  return (
    <div className={styles.App}>
      <header className={styles.header}>qrcode form</header>
      <section className={styles.section}>
        <form>
          <List>
            <InputItem
              {...getFieldProps("outpatientNO", {
                rules: [{ required: true }],
              })}
              clear
              error={getFieldError("outpatientNO")}
              placeholder="请输入就诊卡号"
            >
              就诊卡号
            </InputItem>
            <InputItem
              {...getFieldProps("name", {
                rules: [{ required: true }],
              })}
              clear
              error={getFieldError("name")}
              placeholder="请输入姓名"
            >
              姓名
            </InputItem>
            <InputItem
              {...getFieldProps("idNO", {
                rules: [{ required: true }],
              })}
              clear
              error={getFieldError("idNO")}
              placeholder="请输入身份证号码"
            >
              身份证
            </InputItem>
            <DatePicker
              mode="date"
              extra="请输入出生日期"
              {...getFieldProps("dob", {
                initialValue: "",
                rules: [{ required: true, message: "Must select a date" }],
              })}
            >
              <DatePickerItem error={getFieldError("dob")}>
                出生日期
              </DatePickerItem>
            </DatePicker>
            <DatePicker
              mode="date"
              extra="请输入末次月经时间"
              {...getFieldProps("lmp", {
                initialValue: "",
                rules: [{ required: true, message: "Must select a date" }],
              })}
            >
              <DatePickerItem error={getFieldError("lmp")}>
                末次月经
              </DatePickerItem>
            </DatePicker>
            <InputItem
              clear
              type="digit"
              placeholder="请输入孕次"
              error={getFieldError("gravidity")}
              {...getFieldProps("gravidity", {
                rules: [{ required: true }],
              })}
            >
              孕次
            </InputItem>
            <InputItem
              clear
              type="digit"
              placeholder="请输入产次"
              error={getFieldError("parity")}
              {...getFieldProps("parity", {
                rules: [{ required: true }],
              })}
            >
              产次
            </InputItem>
            <InputItem
              clear
              type="phone"
              placeholder="请输入手机号码"
              error={getFieldError("telephone")}
              {...getFieldProps("telephone", {
                rules: [{ required: true }],
              })}
            >
              手机号
            </InputItem>
          </List>
          <WhiteSpace size="xl" />
          <WingBlank>
            <ModalButton type="primary" label="生成二维码" onSubmit={onSubmit}>
              <QRCode size={270} value={values} />
              {/* {values} */}
            </ModalButton>
          </WingBlank>
        </form>
      </section>
      <footer className={styles.footer}>
        <div className={styles.copyright}>
          <span className={styles.line} />
          <span className={styles.text}>copyright © 广州莲印医疗科技</span>
          <span className={styles.line} />
        </div>
      </footer>
    </div>
  );
}

export default createForm()(App);
