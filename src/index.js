import got from 'got'

export const gotServer = (server, defaultOptions = {}) => {
  const { port, address } = server.address()
  const baseURL = `${address}:${port}`

  return {
    get: (url, options) => got(`${baseURL}${url}`, { ...defaultOptions, ...options }),
    post: (url, options) => got.post(`${baseURL}${url}`, { ...defaultOptions, ...options }),
    put: (url, options) => got.put(`${baseURL}${url}`, { ...defaultOptions, ...options }),
    del: (url, options) => got.delete(`${baseURL}${url}`, { ...defaultOptions, ...options }),
  }
}
