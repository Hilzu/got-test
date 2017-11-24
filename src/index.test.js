import got from 'got'
import Koa from 'koa'
import KoaRouter from 'koa-router'
import { gotServer } from './'

describe('.gotServer()', () => {
  let app
  let server
  let gotSpy

  beforeEach(async () => {
    gotSpy = {
      get: jest.spyOn(got, 'get'),
      post: jest.spyOn(got, 'post'),
      put: jest.spyOn(got, 'put'),
      delete: jest.spyOn(got, 'delete'),
    }

    app = new Koa()
    const router = new KoaRouter()

    router.get('/test', function (ctx, next) {
      ctx.type = 'json'
      ctx.body = { hello: 'world' }
    })

    app.use(router.routes()).use(router.allowedMethods())

    server = await new Promise(resolve => {
      const s = app.listen(3000, () => resolve(s))
    })
  })

  afterEach(async () => {
    await new Promise(resolve => server.close(resolve))
  })

  describe('returns .get() which', () => {
    it('can make GET requests', async () => {
      const ret = await gotServer(server).get('/test')

      expect(ret.body).toEqual(JSON.stringify({ hello: 'world' }))
      expect(ret.headers['content-type']).toContain('application/json')
    })

    it('can set options', async () => {
      await gotServer(server, {
        headers: {
          'X-Test': 123
        }
      }).get('/test')

      expect(gotSpy.get).toHaveBeenCalledWith('http://127.0.0.1:3000/test', {
        headers: {
          'X-Test': 123
        }
      })
    })

    it('can have options overridden', async () => {
      await gotServer(server, {
        headers: {
          'X-Test': 123
        }
      }).get('/test', {
        headers: {
          'X-Test': 456
        }
      })

      expect(gotSpy.get).toHaveBeenCalledWith('http://127.0.0.1:3000/test', {
        headers: {
          'X-Test': 456
        }
      })
    })
  })
})
