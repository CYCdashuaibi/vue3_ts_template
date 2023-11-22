export const getTime = (): string => {
  let message = ''
  const hours = new Date().getHours()
  if (hours >= 0 && hours < 6) {
    message = '凌晨'
  } else if (hours >= 6 && hours < 9) {
    message = '早上'
  } else if (hours >= 9 && hours < 12) {
    message = '上午'
  } else if (hours >= 12 && hours < 14) {
    message = '中午'
  } else if (hours >= 14 && hours < 18) {
    message = '下午'
  } else if (hours >= 18 && hours < 24) {
    message = '晚上'
  }
  return message
}
