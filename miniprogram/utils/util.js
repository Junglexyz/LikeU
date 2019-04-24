/**转换为年月日时分秒 */
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
/**转换为年月日 */
const formatYMD = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('-');
}
/**转换为小时 */
const time = date => {
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [hour, minute, second].map(formatNumber).join(':')
}
/**小时转换为秒 */
const timeToSeconds = time =>{
  let hour = time.substring(0, 2);
  let minute = time.substring(3, 5);
  let seconds = time.substring(6, 8);
  return parseInt(hour) * 60*60 + parseInt(minute)*60 + parseInt(seconds);
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  time: time,
  timeToSeconds: timeToSeconds,
  formatYMD: formatYMD
}
