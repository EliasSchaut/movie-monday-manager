
import { get_cookie } from '@/util/cookie'
import { store } from './store';
import i18next from 'i18next';

export function call(route: string, method?: string, body?: any) {
  return fetch(route, {
    method: method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " +  (get_cookie("access_token") ?? ""),
      "Accept-Language": i18next.language
    },
    body: body ? JSON.stringify(body) : undefined
  }).then(async (res) => {
    const data = await res.json()
    if (!res.ok || (data.hasOwnProperty("show_alert") && data.show_alert)) {
      if (data.hasOwnProperty("message")) {
        store.show_alert(store.generate_type(res.status), data.message);
      }
    }

    return data
  })
}
