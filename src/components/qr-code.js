/*
 * @Author: ZHONG JUN
 * @Date: 2020-05-23 23:01:59
 * @Description: qr code
 */ 

import React from 'react'

const QRCode = require("qrcode.react");

export default function QrCode({ size = 128 }) {
  return (
    <div>
      <QRCode size={size} value="http://facebook.github.io/react/" />
    </div>
  );
}
