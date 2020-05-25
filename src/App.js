import React, { useState, useEffect } from 'react';

import { DatePicker, List, InputItem, WhiteSpace, WingBlank, Toast } from 'antd-mobile';
import { createForm } from 'rc-form';
import QRCode from 'qrcode.react';
import DatePickerItem from './components/date-picker-item';
import ModalButton from './components/modal-button';
import * as utils from './utils';

import styles from './App.module.scss';

const nowTimeStamp = Date.now();

function App({
  form: {
    getFieldProps,
    getFieldError,
    validateFields,
    setFieldsValue,
    getFieldValue,
  },
}) {
  const [values, setValues] = useState("");
  // 方便测试
  useEffect(() => {
    let cacheValues = localStorage.getItem("values");
    if (!cacheValues) {
      return;
    }
    // 320205199603075967
    cacheValues = JSON.parse(cacheValues);
    setFieldsValue({
      ...cacheValues,
      dob: new Date(cacheValues.dob),
      lmp: new Date(cacheValues.lmp),
      telephone: utils.formatPhone(cacheValues.telephone),
    });
  }, []);
  const getError = (name) => {
    const error = getFieldError(name);
    if (error) {
      return error.map((info) => {
        return Toast.info(info, 2);
      });
    }
    return null;
  };

  const onSubmit = () => {
    let result = "";
    validateFields(
      (
        error,
        { outpatientNO, name, idNO, dob, lmp, gravidity, parity, telephone }
      ) => {
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
          telephone: telephone.replace(/\s*/g, ""),
        };
        // 缓存数据
        localStorage.setItem("values", JSON.stringify(val));
        const valueStr = Object.values(val).join("#");
        const qrcodeValue = `${"ZJ"}#${valueStr}`;
        setValues(qrcodeValue);
        result = valueStr;
        // console.log(val, qrcodeValue);
      }
    );
    return result;
  };
  return (
    <div className={styles.App}>
      <header className={styles.header}>
        <span className={styles.logo} />
        <div className={styles.title}>产科信息码</div>
      </header>
      <section className={styles.section}>
        <form>
          <List>
            <InputItem
              type="tel"
              maxLength={12}
              error={getFieldError("outpatientNO")}
              onErrorClick={() => getError("outpatientNO")}
              placeholder="请输入就诊卡号"
              {...getFieldProps("outpatientNO", {
                rules: [{ required: true, message: "请输入就诊卡号" }],
              })}
            >
              就诊卡号
            </InputItem>
            <InputItem
              {...getFieldProps("name", {
                rules: [{ required: true, message: "请输入姓名" }],
              })}
              clear
              maxLength={12}
              error={getFieldError("name")}
              onErrorClick={() => getError("name")}
              placeholder="请输入姓名"
            >
              姓名
            </InputItem>
            <InputItem
              type="tel"
              maxLength={18}
              error={getFieldError("idNO")}
              onErrorClick={() => getError("idNO")}
              placeholder="请输入身份证号码"
              {...getFieldProps("idNO", {
                validateFirst: true,
                onChange: (value) => {
                  if (value && value.length === 18) {
                    const result = utils.checkIdNo(value);
                    setFieldsValue({ dob: new Date(result.birthday) });
                  }
                },
                rules: [
                  { required: true, message: "请输入身份证号码" },
                  {
                    validator: async (rule, value, callback) => {
                      const result = utils.checkIdNo(value);
                      if (!result.status) {
                        callback("请输入正确的身份证号码");
                      } else {
                        callback();
                      }
                      throw new Error();
                    },
                  },
                ],
              })}
              clear
            >
              身份证
            </InputItem>
            <DatePicker
              mode="date"
              extra="请选择出生日期"
              maxDate={new Date(nowTimeStamp - 1000 * 60 * 60 * 24 * 365 * 10)}
              minDate={new Date(nowTimeStamp - 1000 * 60 * 60 * 24 * 365 * 50)}
              {...getFieldProps("dob", {
                rules: [
                  { required: true, message: "请选择出生日期" },
                  { type: "date" },
                ],
              })}
            >
              <DatePickerItem
                error={getFieldError("dob")}
                onErrorClick={() => getError("dob")}
              >
                出生日期
              </DatePickerItem>
            </DatePicker>
            <DatePicker
              mode="date"
              extra="请选择末次月经时间"
              minDate={new Date(nowTimeStamp - 1000 * 60 * 60 * 24 * 365)}
              maxDate={new Date(nowTimeStamp + 1e7)}
              {...getFieldProps("lmp", {
                rules: [{ required: true, message: "请选择末次月经时间" }],
              })}
            >
              <DatePickerItem
                error={getFieldError("lmp")}
                onErrorClick={() => getError("lmp")}
              >
                末次月经
              </DatePickerItem>
            </DatePicker>
            <InputItem
              clear
              type="tel"
              maxLength={2}
              placeholder="请输入孕次"
              error={getFieldError("gravidity")}
              onErrorClick={() => getError("gravidity")}
              {...getFieldProps("gravidity", {
                validateFirst: true,
                rules: [
                  { required: true, message: "请输入孕次" },
                  // { len: 1, message: "请输入合理的孕次，您输入的孕次大于9" },
                  {
                    validator: (rule, value, callback) => {
                      const parity = getFieldValue("parity");
                      if (parity && Number(value) <= Number(parity)) {
                        Toast.info("请填入正确的孕次，孕次大于产次", 2);
                        callback("请填入正确的孕次，孕次大于产次。");
                      } else {
                        callback();
                      }
                    },
                  },
                ],
              })}
            >
              孕次
            </InputItem>
            <InputItem
              clear
              type="tel"
              maxLength={2}
              placeholder="请输入产次"
              error={getFieldError("parity")}
              onErrorClick={() => getError("parity")}
              {...getFieldProps("parity", {
                validateFirst: true,
                rules: [
                  { required: true, message: "请输入产次" },
                  // { len: 1, message: "请输入合理的产次，您输入的产次大于9" },
                  {
                    validator: async (rule, value, callback) => {
                      const gravidity = getFieldValue("gravidity");
                      if (gravidity && Number(value) >= Number(gravidity)) {
                        Toast.info("请填入正确的产次，产次小于孕次。", 2);
                        callback("请填入正确的产次，产次小于孕次。");
                      } else {
                        callback();
                      }
                      throw new Error("Something wrong!");
                    },
                  },
                ],
              })}
            >
              产次
            </InputItem>
            <InputItem
              clear
              type="phone"
              placeholder="请输入手机号码"
              error={getFieldError("telephone")}
              onErrorClick={() => getError("telephone")}
              {...getFieldProps("telephone", {
                validateFirst: true,
                rules: [
                  { required: true, message: "请输入手机号码" },
                  // {
                  //   pattern: /^1[3456789]\d{9}$/,
                  //   message: "请输入11位正确的手机号码",
                  // },
                  {
                    validator: async (rule, value, callback) => {
                      const val = value.replace(/\s*/g, "");
                      if (val && !utils.checkPhone(val)) {
                        callback("请输入11位正确的手机号码");
                      } else {
                        callback();
                      }
                      // 抛出错误捕获
                      throw new Error();
                    },
                  },
                ],
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
        <p className={styles.tips}>请自行截图保存该二维码</p>
      </section>
      <footer className={styles.footer}>
        <div className={styles.copyright}>
          <span className={styles.line} />
          <span className={styles.text}>Copyright © 广州莲印医疗科技</span>
          <span className={styles.line} />
        </div>
      </footer>
    </div>
  );
}

export default createForm()(App);
