
import { get_cookie } from '@/util/cookie'
import { store } from './store';

export function call(route: string, method?: string, body?: any) {
  return fetch(route, {
    method: method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " +  (get_cookie("access_token") ?? "")
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
