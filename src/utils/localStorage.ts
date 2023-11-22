// 存储本地数据
export const SET_TOKEN = (token: string) => {
  localStorage.setItem('TOKEN', token)
}

export const GET_TOKEN = (): string | null => {
  return localStorage.getItem('TOKEN')
}

export const REMOVE_TOKEN = () => {
  localStorage.removeItem('TOKEN')
}

export const SET_USER_INFO = (userInfo: string) => {
  localStorage.setItem('USER_INFO', userInfo)
}

export const GET_USER_INFO = (): string | null => {
  return localStorage.getItem('USER_INFO')
}

export const REMOVE_USER_INFO = () => {
  localStorage.removeItem('USER_INFO')
}
