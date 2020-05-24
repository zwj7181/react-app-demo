/*
 * @Author: ZHONG JUN
 * @Date: 2020-05-23 22:25:34
 * @Description: 
 */ 

import React, { useState } from 'react';
import { Button, Modal } from 'antd-mobile';

import styles from './index.module.scss';

export default function ModalButton({ children, label, type, onSubmit }) {
  const [visible, setViseble] = useState(false)
  const show = () => {
    const value = onSubmit();
    if (!value) {
      return;
    }
    setViseble(true);
  }
  const hide = () => setViseble(false)
  return (
    <>
      <Button type={type} onClick={show} className={styles.button}>
        {label}
      </Button>
      <Modal
        closable
        transparent
        visible={visible}
        maskClosable={false}
        onClose={hide}
        className={styles.modal}
      >
        <div className={styles.content}>{children}</div>
      </Modal>
    </>
  );
}
