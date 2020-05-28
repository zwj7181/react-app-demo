/*
 * @Author: ZHONG JUN
 * @Date: 2020-05-24 00:12:38
 * @Description: common utils
 */

export function formatDate(date) {
  const pad = (n) => (n < 10 ? `0${n}` : n);
  const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}`;
  return dateStr;
}

export function formatDateTime(datetime) {
  const pad = (n) => (n < 10 ? `0${n}` : n);
  const dateStr = `${datetime.getFullYear()}-${pad(
    datetime.getMonth() + 1
  )}-${pad(datetime.getDate())}`;
  const timeStr = `${pad(datetime.getHours())}:${pad(datetime.getMinutes())}`;
  return `${dateStr} ${timeStr}`;
}

export function formatPhone(phone) {
  let str = phone.replace(/\s*/g, "");
  let len = str.length;
  switch (true) {
    case len > 11:
      str = str.substr(0, 3) + ' ' + str.substr(3, 4) + ' ' + str.substr(7, 4);
      break;
    case len > 7:
      str = str.substr(0, 3) + ' ' + str.substr(3, 4) + ' ' + str.substr(7);
      break;
    case len > 3:
      str = str.substr(0, 3) + ' ' + str.substr(3);
      break;
    default:
  }
  return str;
}

export function checkPhone(phone) {
  const str = phone.replace(/\s*/g, "");
  if (/^1[3456789]\d{9}$/.test(str)) {
    return true;
  }
  return false;
}

export function checkIdNo(card) {
  let text = "";
  if (card === "") {
    text = "请输入身份证号码";
  } else if (!isCardNo(card)) {
    text = "请输入符合规范的身份证号码！";
  } else if (!checkProvince(card)) {
    text = "不存在的省份，请输入符合规范的身份证号码！";
  } else if (!checkBirthday(card)) {
    text = "出生年月不合理，请输入符合规范的身份证号码！";
  } else if (!checkParity(card)) {
    text = "校验位不正确，请输入符合规范的身份证号码！";
  }
  if (text) {
    return { status: false, message: text };
  }
  return {
    status: true,
    province: checkProvince(card),
    birthday: checkBirthday(card),
    gender: checkSex(card),
    age: checkAge(card),
  };
}

const city = {
  11: "北京",
  12: "天津",
  13: "河北",
  14: "山西",
  15: "内蒙古",
  21: "辽宁",
  22: "吉林",
  23: "黑龙江",
  31: "上海",
  32: "江苏",
  33: "浙江",
  34: "安徽",
  35: "福建",
  36: "江西",
  37: "山东",
  41: "河南",
  42: "湖北",
  43: "湖南",
  44: "广东",
  45: "广西",
  46: "海南",
  50: "重庆",
  51: "四川",
  52: "贵州",
  53: "云南",
  54: "西藏",
  61: "陕西",
  62: "甘肃",
  63: "青海",
  64: "宁夏",
  65: "新疆",
  71: "台湾",
  81: "香港",
  82: "澳门",
  91: "国外",
};

/**
 * 检查号码是否符合规范，包括长度，类型
 * @param {string} card 证件号码
 */
function isCardNo(card) {
  //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
  const reg = /(^\d{15}$)|(^\d{17}(\d|X|x)$)/;
  if (!reg.test(card)) {
    return false;
  }
  return true;
}

/**
 * 取身份证前两位,校验省份
 * @param {string} card 证件号码
 */
function checkProvince(card) {
  var province = card.substr(0, 2);
  if (city[province] === undefined) {
    return false;
  }
  return city[province];
}
/**
 * 检查生日是否正确
 * @param {string} card 证件号码
 */
function checkBirthday(card) {
  const len = card.length;
  //身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字
  if (len === 15) {
    const re_fifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/;
    const arr_data = card.match(re_fifteen);
    const year = arr_data[2];
    const month = arr_data[3];
    const day = arr_data[4];
    const birthday = new Date("19" + year + "/" + month + "/" + day);
    return verifyBirthday("19" + year, month, day, birthday);
  }
  //身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X
  if (len === 18) {
    const re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X|x)$/;
    const arr_data = card.match(re_eighteen);
    const year = arr_data[2];
    const month = arr_data[3];
    const day = arr_data[4];
    const birthday = new Date(year + "/" + month + "/" + day);
    return verifyBirthday(Number(year), Number(month), Number(day), birthday);
  }
  return false;
}

/**
 * 校验日期
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @param {date} birthday
 */
function verifyBirthday(year, month, day, birthday) {
  const now = new Date();
  const now_year = now.getFullYear();
  // 年月日是否合理
  if (
    birthday.getFullYear() === year &&
    birthday.getMonth() + 1 === month &&
    birthday.getDate() === day
  ) {
    // 判断年份的范围（3岁到100岁之间)
    var time = now_year - year;
    if (time >= 3 && time <= 100) {
      return (
        birthday.getFullYear() +
        "-" +
        (birthday.getMonth() + 1) +
        "-" +
        birthday.getDate()
      );
    }
  }
  return false;
}

/**
 * 校验位的检测
 * @param {string} card 证件号码F
 */
function checkParity(card) {
  // 15位转18位
  card = changeFivteenToEighteen(card);
  const len = card.length;
  if (len === 18) {
    // eslint-disable-next-line no-array-constructor
    const arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
    // eslint-disable-next-line no-array-constructor
    const arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
    let cardTemp = 0;
    let valnum = null;
    for (let i = 0; i < 17; i++) {
      cardTemp += card.substr(i, 1) * arrInt[i];
    }
    valnum = arrCh[cardTemp % 11];
    if (valnum.toUpperCase() === card.substr(17, 1).toUpperCase()) {
      return true;
    }
    return false;
  }
  return false;
}

/**
 * 15位转18位身份证号
 * @param {string} card 证件号码
 */
function changeFivteenToEighteen(card) {
  if (card.length === 15) {
    // eslint-disable-next-line no-array-constructor
    const arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
    // eslint-disable-next-line no-array-constructor
    const arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
    let cardTemp = 0;
    card = card.substr(0, 6) + "19" + card.substr(6, card.length - 6);
    for (let i = 0; i < 17; i++) {
      cardTemp += card.substr(i, 1) * arrInt[i];
    }
    card += arrCh[cardTemp % 11];
    return card;
  }
  return card;
}

/**
 *
 * @param {string} card
 */
function checkSex(card) {
  let sex = 0;
  let sexNo = 0;
  if (card.length === 18) {
    sexNo = card.substring(16, 17);
  } else if (card.length === 15) {
    sexNo = card.substring(14, 15);
  }
  sex = sexNo % 2;
  if (sex === 0) {
    sex = 2;
  }
  return sex === 1 ? "男" : "女";
}

export function checkAge(card) {
  if (card === null) return null;
  let len = card.length;
  var arrdata, year, month, day, age;
  var myDate = new Date();
  var nowY = myDate.getFullYear();
  var nowM = myDate.getMonth() + 1;
  var nowD = myDate.getDate(); // 获取当前日(1-31)
  if (len === 15) {
    let refifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/;
    arrdata = card.match(refifteen);
    year = arrdata[2];
    month = arrdata[3];
    day = arrdata[4];
    if (nowM > month || (nowM === month && nowD >= day)) {
      age = nowY - year;
    } else {
      age = nowY - year - 1;
    }
  }
  if (len === 18) {
    var reeighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
    arrdata = card.match(reeighteen);
    year = arrdata[2];
    month = arrdata[3];
    day = arrdata[4];
    if (nowM > month || (nowM === month && nowD >= day)) {
      age = nowY - year;
    } else {
      age = nowY - year - 1;
    }
  }
  if (age < 0) return null;
  else return age;
}
