import got from 'got'
import Koa from 'koa'
import KoaRouter from 'koa-router'
import koaBodyParser from 'koa-bodyparser'
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

    router.post('/testpost', function (ctx, next) {
      ctx.type = 'json'
      ctx.body = ctx.request.body
    })

    router.put('/testput', function (ctx, next) {
      ctx.type = 'json'
      ctx.body = ctx.request.body
    })

    router.del('/testdel', function (ctx, next) {
      ctx.type = 'json'
      ctx.body = ctx.request.body
    })

    app
      .use(koaBodyParser())
      .use(router.routes())

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
      expect(gotSpy.get).toHaveBeenCalledWith('http://127.0.0.1:3000/test', {})
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

  describe('returns .post() which', () => {
    it('can make POST requests', async () => {
      const ret = await gotServer(server).post('/testpost', {
        json: true,
        body: { hello: 'world' }
      })

      expect(ret.body).toEqual({ hello: 'world' })
      expect(ret.headers['content-type']).toContain('application/json')
      expect(gotSpy.post).toHaveBeenCalledWith('http://127.0.0.1:3000/testpost', {
        json: true,
        body: { hello: 'world' }
      })
    })

    it('can set options', async () => {
      await gotServer(server, {
        json: true,
        headers: {
          'X-Test': 123
        }
      }).post('/testpost')

      expect(gotSpy.post).toHaveBeenCalledWith('http://127.0.0.1:3000/testpost', {
        json: true,
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
      }).post('/testpost', {
        headers: {
          'X-Test': 456
        }
      })

      expect(gotSpy.post).toHaveBeenCalledWith('http://127.0.0.1:3000/testpost', {
        headers: {
          'X-Test': 456
        }
      })
    })
  })

  describe('returns .put() which', () => {
    it('can make PUT requests', async () => {
      const ret = await gotServer(server).put('/testput', {
        json: true,
        body: { hello: 'world' }
      })

      expect(ret.body).toEqual({ hello: 'world' })
      expect(ret.headers['content-type']).toContain('application/json')
      expect(gotSpy.put).toHaveBeenCalledWith('http://127.0.0.1:3000/testput', {
        json: true,
        body: { hello: 'world' }
      })
    })

    it('can set options', async () => {
      await gotServer(server, {
        json: true,
        headers: {
          'X-Test': 123
        }
      }).put('/testput')

      expect(gotSpy.put).toHaveBeenCalledWith('http://127.0.0.1:3000/testput', {
        json: true,
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
      }).put('/testput', {
        headers: {
          'X-Test': 456
        }
      })

      expect(gotSpy.put).toHaveBeenCalledWith('http://127.0.0.1:3000/testput', {
        headers: {
          'X-Test': 456
        }
      })
    })
  })

  describe('returns .del() which', () => {
    it('can make DELETE requests', async () => {
      const ret = await gotServer(server).del('/testdel', {
        json: true,
        body: { hello: 'world' }
      })

      expect(ret.body).toEqual({ hello: 'world' })
      expect(ret.headers['content-type']).toContain('application/json')
      expect(gotSpy.delete).toHaveBeenCalledWith('http://127.0.0.1:3000/testdel', {
        json: true,
        body: { hello: 'world' }
      })
    })

    it('can set options', async () => {
      await gotServer(server, {
        json: true,
        headers: {
          'X-Test': 123
        }
      }).del('/testdel')

      expect(gotSpy.delete).toHaveBeenCalledWith('http://127.0.0.1:3000/testdel', {
        json: true,
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
      }).del('/testdel', {
        headers: {
          'X-Test': 456
        }
      })

      expect(gotSpy.delete).toHaveBeenCalledWith('http://127.0.0.1:3000/testdel', {
        headers: {
          'X-Test': 456
        }
      })
    })
  })
})
