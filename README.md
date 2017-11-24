# got-test

[![Build Status](https://secure.travis-ci.org/hiddentao/got-test.svg?branch=master)](http://travis-ci.org/hiddentao/got-test)
[![NPM module](https://badge.fury.io/js/got-test.svg)](https://badge.fury.io/js/got-test)

This is a wrapper around [Got](https://www.npmjs.com/package/got) to enable
easy testing for Node application servers, similar to what [supertest](https://github.com/visionmedia/supertest) does.

Features:

* Works with built-in [Server](https://nodejs.org/dist/latest-v8.x/docs/api/net.html#net_class_net_server) object (including [Koa](https://github.com/koajs/koa) and [Express](https://expressjs.com/) applications)
* Supports default options with per-request overrides
* Works with your choice of test framework and assertion library
* Can work in browser too
* Comprehensive test coverage

## Installation

```shell
npm install got-test
```
Or if using Yarn:

```shell
yarn add got-test
```

## Basic usage

_The examples below assume [Jest](http://facebook.github.io/jest/) as the testing framework with Babel transpilation enabled_.

**Koa v2**

```js
import Koa from 'koa'
import KoaRouter from 'koa-router'
import { gotServer } from 'got-test'

describe('app', () => {
  let server

  beforeEach(done => {
    const app = new Koa()
    const router = new KoaRouter()

    router.get('/blog', async ctx => ctx.body = 'hello world!')

    app.use(router.routes())

    server = app.listen(3000, done)
  })

  afterEach(done => {
    server.close(done)
  })

  it('returns blog posts', async () => {
    const request = gotServer(server)

    const ret = await request.get('/blog')

    expect(ret.body).toEqual('hello world!')
  })
})
```

**Express v4**

```js
import express from 'express'
import { gotServer } from 'got-test'

describe('app', () => {
  let server

  beforeEach(done => {
    const app = express()

    app.get('/', (req, res) => res.send('hello world!'))

    server = app.listen(3000, done)
  })

  afterEach(done => {
    server.close(done)
  })

  it('returns blog posts', async () => {
    const request = gotServer(server)

    const ret = await request.get('/blog')

    expect(ret.body).toEqual('hello world!')
  })
})
```

**Vanilla Node.js**

```js
import http from 'http'
import { gotServer } from 'got-test'

describe('app', () => {
  let server

  beforeEach(done => {
    server = http.createServer((req, res) => {
      res.statusCode = 200
      res.setHeader('Content-Type', 'text/plain')
      res.end('hell world!')
    })

    server.listen(3000, done)
  })

  afterEach(done => {
    server.close(done)
  })

  it('returns blog posts', async () => {
    const request = gotServer(server)

    const ret = await request.get('/blog')

    expect(ret.body).toEqual('hello world!')
  })
})
```

:)

## API

### gotServer (httpServer, defaultOptions = {})

**Param: httpServer**

This must be a [net.Server](https://nodejs.org/dist/latest-v8.x/docs/api/net.html#net_class_net_server) instance or an
object which provides an `address()` method which does the same thing as
[`net.Server.address()`](https://nodejs.org/dist/latest-v8.x/docs/api/net.html#net_server_address) (this is how you can use this lib in a browser)

**Param: defaultOptions**

This gets passed to `got` as its `options` parameter ([see docs](https://www.npmjs.com/package/got#goturl-options)) for any subsequent
calls. All options can be overridden in individual requests (see below).

**Returns**

It return an object with the following methods available:

* `get(url, options = {})` - calls `got.get(url, { ...defaultOptions, ...options })`
* `post(url, options = {})` - calls `got.post(url, { ...defaultOptions, ...options })`
* `put(url, options = {})` - calls `got.put(url, { ...defaultOptions, ...options })`
* `del(url, options = {})` - calls `got.delete(url, { ...defaultOptions, ...options })`

As you can see each call passes the `got` call result right back to you, so it's
as if you're using `got` directly.

## License

MIT - see [LICENSE.md](LICENSE.md)
