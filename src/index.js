import got from 'got'

export const gotServer = (server, defaultOptions = {}) => {
  const { port, address } = server.address()
  const sanitizedAdress = (address && address !== '::') ? address : '127.0.0.1'
  const baseUrl = `http://${sanitizedAdress}:${port}`

  return {
    get: (url, options) => got.get(`${baseUrl}${url}`, { ...defaultOptions, ...options }),
    post: (url, options) => got.post(`${baseUrl}${url}`, { ...defaultOptions, ...options }),
    put: (url, options) => got.put(`${baseUrl}${url}`, { ...defaultOptions, ...options }),
    del: (url, options) => got.delete(`${baseUrl}${url}`, { ...defaultOptions, ...options }),
  }
}
