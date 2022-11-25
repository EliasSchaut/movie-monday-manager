import Cookies from 'js-cookie'

export const set_cookie = (key: string, value: string, path?: string) => {
  Cookies.set(key, value, {
    expires: 7,
    path: path || '',
  })
}

export const get_cookie = (key: string) => {
  return Cookies.get(key)
}

export const get_cookie_all = () => {
  return Cookies.get()
}

export const remove_cookie = (key: string, path?: string) => {
  Cookies.remove(key, { path: path || '' })
}
