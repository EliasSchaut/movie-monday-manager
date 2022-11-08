
export function call(route: string, method?: string, body?: any) {
  return fetch(route, {
    method: method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " +  localStorage.getItem("access_token")
    },
    body: body ? JSON.stringify(body) : undefined
  })
}
