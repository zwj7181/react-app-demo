import React from 'react';

import { DatePicker, List, Button, InputItem, WhiteSpace } from 'antd-mobile';
import { createForm } from 'rc-form';

import logo from './logo.svg';
import './App.css';

const QRCode = require('qrcode.react');

function App({ form }) {
  const { getFieldProps } = form;
  return (
    <div className="App">
      <header className="App-header">
        qrcode form
      </header>
      <section>
        <form>
          <List renderHeader={() => 'Customize to focus'}>
            <InputItem
              {...getFieldProps('autofocus')}
              clear
              placeholder="auto focus"
            >标题</InputItem>
            <InputItem
              {...getFieldProps('focus')}
              clear
              placeholder="click the button below to focus"
            >标题</InputItem>
            <List.Item>
              <div
                style={{ width: '100%', color: '#108ee9', textAlign: 'center' }}
              >
                click to focus
              </div>
            </List.Item>
            <Button type="primary">primary</Button><WhiteSpace />
          </List>
        </form>
      </section>
      <footer>
        <QRCode value="http://facebook.github.io/react/" />
      </footer>
    </div>
  );
}

export default createForm()(App);
