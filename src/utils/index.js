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
  let str = phone.toString().replace(/ /g, "");
  let len = str.length;
  switch (true) {
    case len > 11: 
      str = str.substr(0, 3) + ' ' + str.substr(3, 4) + ' ' + str.substr(7, 4);
      this.value = str;
      break;
    case len > 7:
      str = str.substr(0, 3) + ' ' + str.substr(3, 4) + ' ' + str.substr(7);
      this.value = str;
      break;
    case len > 3:
      str = str.substr(0, 3) + ' ' + str.substr(3);
      this.value = str;
      break;
    default:
      this.value = str;
  }
  return str;           
}