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