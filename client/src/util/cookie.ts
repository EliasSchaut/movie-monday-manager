import Cookies from 'js-cookie'

export const set_cookie = (key: string, value: string, expires_in_days = 7) => {
  Cookies.set(key, value, {
    expires: expires_in_days,
  })
}

export const get_cookie = (key: string) => {
  return Cookies.get(key)
}

export const get_cookie_all = () => {
  return Cookies.get()
}

export const remove_cookie = (key: string) => {
  Cookies.remove(key)
}
