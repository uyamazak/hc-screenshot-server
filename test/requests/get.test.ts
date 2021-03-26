import { test } from 'tap'
import { InjectOptions } from 'light-my-request'
import { app } from '../../src/app'
import {
  TEST_TARGET_URL,
} from '../../src/config'

interface Test {
  tearDown(cb: unknown): unknown
}
async function build(t: Test) {
  const myApp = await app({ pagesNum: 2 })
  t.tearDown(myApp.close.bind(myApp))
  return myApp
}

test('request test', async (t) => {

  t.test('GET / without url', async (t) => {
    const app = await build(t)
    const res = await app.inject({
      method: 'GET',
      url: '/',
      query: {
        url: '',
      },
    } as InjectOptions)
    t.equal(res.statusCode, 400)
    t.end()
  })

  t.test('GET / with default preset name', async (t) => {
    const app = await build(t)
    const res = await app.inject({
      method: 'GET',
      url: '/',
      query: {
        url: TEST_TARGET_URL,
      },
    } as InjectOptions)
    t.equal(res.statusCode, 200)
    t.equal(res.headers['content-type'], 'image/png')
    t.end()
  })
})
