/*
 * @Author       : ZhongJun
 * @Date         : 2021-05-31
 * @Descriptions : 住院
 */
import React, { useState, useEffect } from "react";

import {
  DatePicker,
  List,
  InputItem,
  WhiteSpace,
  WingBlank,
  Toast,
} from "antd-mobile";
import { createForm } from "rc-form";
import QRCode from "qrcode.react";
import DatePickerItem from "@/components/date-picker-item";
import ModalButton from "@/components/modal-button";
import * as utils from "@/utils";

import styles from "../index/index.module.scss";

const nowTimeStamp = Date.now();

function Inpatient({
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
    let cacheValues = localStorage.getItem("inpatient");
    if (!cacheValues) {
      return;
    }
    // 320205199603075967
    cacheValues = JSON.parse(cacheValues);
    setFieldsValue({
      ...cacheValues,
      lmp: cacheValues.lmp ? new Date(cacheValues.lmp) : "",
    });
  }, [setFieldsValue]);
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
        { outpatientNO, name, age, bedNO, lmp, gravidity, parity, inpatientNO }
      ) => {
        if (error) {
          return;
        }
        const val = {
          name,
          lmp: utils.formatDate(lmp),
          age,
          gravidity,
          parity,
          outpatientNO,
          inpatientNO,
          bedNO,
        };
        // 缓存数据
        localStorage.setItem("inpatient", JSON.stringify(val));

        const qrcodeValue = JSON.stringify(val);
        setValues(qrcodeValue);
        result = qrcodeValue;
      }
    );
    return result;
  };
  return (
    <div className={styles.App}>
      <header className={styles.header}>
        <span className={styles.logo} />
        <div className={styles.title}>产科住院信息码</div>
      </header>
      <section className={styles.section}>
        <form>
          <List>
            <InputItem
              clear
              type="text"
              maxLength={12}
              error={getFieldError("name")}
              onErrorClick={() => getError("name")}
              placeholder="请输入姓名"
              {...getFieldProps("name", {
                rules: [{ required: true, message: "请输入姓名" }],
              })}
            >
              <i className={styles.starred}>*</i>姓名
            </InputItem>
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
                <i className={styles.starred}>*</i>末次月经
              </DatePickerItem>
            </DatePicker>
            <InputItem
              clear
              type="tel"
              maxLength={2}
              error={getFieldError("age")}
              onErrorClick={() => getError("age")}
              placeholder="请输入年龄"
              {...getFieldProps("age", {
                rules: [{ required: true, message: "请输入年龄" }],
              })}
            >
              <i className={styles.starred}>*</i>年龄
            </InputItem>
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
                  { required: false, message: "请输入孕次" },
                  { len: 1, message: "请输入合理的孕次，您输入的孕次大于9" },
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
                  { required: false, message: "请输入产次" },
                  { len: 1, message: "请输入合理的产次，您输入的产次大于9" },
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
              type="text"
              maxLength={16}
              error={getFieldError("outpatientNO")}
              onErrorClick={() => getError("outpatientNO")}
              placeholder="请输入就诊卡号"
              {...getFieldProps("outpatientNO", {
                rules: [{ required: false, message: "请输入就诊卡号" }],
              })}
            >
              就诊卡号
            </InputItem>
            <InputItem
              clear
              type="text"
              labelNumber={7}
              maxLength={12}
              placeholder="住院孕妇请填写"
              onErrorClick={() => getError("inpatientNO")}
              {...getFieldProps("inpatientNO", {
                validateFirst: true,
                rules: [{ required: false, message: "住院孕妇请输入住院号" }],
              })}
            >
              住院号 <i className={styles.remark}>(选填)</i>
            </InputItem>
            <InputItem
              clear
              type="text"
              labelNumber={7}
              maxLength={12}
              error={getFieldError("bedNO")}
              onErrorClick={() => getError("bedNO")}
              placeholder="住院孕妇请填写"
              {...getFieldProps("bedNO", {
                rules: [{ required: false, message: "住院孕妇请输入床号" }],
              })}
            >
              床号 <i className={styles.remark}>(选填)</i>
            </InputItem>
          </List>
          <WhiteSpace size="xl" />
          <WingBlank>
            <ModalButton
              // title="二维码"
              type="primary"
              label="生成二维码"
              onSubmit={onSubmit}
            >
              <QRCode size={200} value={values} />
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

export default createForm()(Inpatient);
