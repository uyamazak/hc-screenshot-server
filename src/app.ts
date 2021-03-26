import fastify, { FastifyInstance } from 'fastify'
import formBody from 'fastify-formbody'
import bearerAuthPlugin from 'fastify-bearer-auth'
import { Page } from 'puppeteer'
import { hcPages } from '@uyamazak/fastify-hc-pages'
import { AppConfig, GetQuerystring } from './types/hc-screenshot-server'
import {
  BEARER_AUTH_SECRET_KEY,
  PAGES_NUM,
  USER_AGENT,
  PAGE_TIMEOUT_MILLISECONDS,
  EMULATE_MEDIA_TYPE_SCREEN_ENABLED,
  ACCEPT_LANGUAGE,
  FASTIFY_LOG_LEVEL,
  FASTIFY_BODY_LIMIT,
  DEFAULT_VIEWPORT,
} from './config'

const getSchema = {
  querystring: {
    url: { type: 'string' },
  },
}

const createScreenshotHttpHeader = (buffer: Buffer|string) => ({
  'Content-Type': 'image/png',
  'Content-Length': buffer.length,
  // prevent cache
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  Pragma: 'no-cache',
  Expires: 0,
})

const defaultAppConfig: AppConfig = {
  bearerAuthSecretKey: BEARER_AUTH_SECRET_KEY,
  pagesNum: PAGES_NUM,
  userAgent: USER_AGENT,
  pageTimeoutMilliseconds: PAGE_TIMEOUT_MILLISECONDS,
  emulateMediaTypeScreenEnabled: EMULATE_MEDIA_TYPE_SCREEN_ENABLED,
  acceptLanguage: ACCEPT_LANGUAGE,
  fastifyLogLevel: FASTIFY_LOG_LEVEL,
  fastifyBodyLimit: FASTIFY_BODY_LIMIT,
  viewport: DEFAULT_VIEWPORT,
}

export const app = async (
  appConfig = {} as Partial<AppConfig>
): Promise<FastifyInstance> => {
  const {
    bearerAuthSecretKey,
    pagesNum,
    userAgent,
    pageTimeoutMilliseconds,
    emulateMediaTypeScreenEnabled,
    acceptLanguage,
    fastifyLogLevel,
    fastifyBodyLimit,
    viewport,
  } = { ...defaultAppConfig, ...appConfig }

  const server = fastify({
    logger: { level: fastifyLogLevel },
    bodyLimit: fastifyBodyLimit,
  })
  server.register(formBody)
  server.register(hcPages, {
    pagesNum,
    pageOptions: {
      userAgent,
      pageTimeoutMilliseconds,
      emulateMediaTypeScreenEnabled,
      acceptLanguage,
      viewport,
    },
  })

  if (bearerAuthSecretKey) {
    const keys = new Set([bearerAuthSecretKey])
    server.register(bearerAuthPlugin, { keys })
  }

  server.get<{
    Querystring: GetQuerystring
  }>('/', { schema: getSchema }, async (request, reply) => {
    const { url } = request.query
    if (!url) {
      reply.code(400).send({ error: 'url is required' })
      return
    }

    try {
      const buffer = await server.runOnPage<Buffer|string|void>(async (page: Page) => {
        await page.goto(url)
        const buffer = await page.screenshot()
        return buffer
      })
      if (!buffer) {
        reply.code(500).send({ error: 'screenshot() faild' })
        return
      } else {
        reply.headers(createScreenshotHttpHeader(buffer))
        reply.send(buffer)
      }
    } catch (error) {
      console.error(`error ${error}`)
      reply.code(500).send({ error, url })
      return
    }
  })

  return server
}
