import { PaperFormat } from 'puppeteer'

const toBoolean = (val: string | undefined) => {
  return val === 'true'
}
const toNumber = (val: string | undefined) => {
  if (val) {
    return Number(val)
  } else {
    return undefined
  }
}


/**
 * Browser Page
 */
export const USER_AGENT = process.env.HCSCREENSHOT_USER_AGENT ?? undefined
export const PAGES_NUM = toNumber(process.env.HCSCREENSHOT_PAGES_NUM) ?? 3
export const PAGE_TIMEOUT_MILLISECONDS = toNumber(
  process.env.HCSCREENSHOT_PAGE_TIMEOUT_MILLISECONDS ?? '30000'
)
// 'true' or otherwise
// @see https://pptr.dev/#?product=Puppeteer&version=v8.0.0&show=api-pageemulatemediatypetype
export const EMULATE_MEDIA_TYPE_SCREEN_ENABLED = toBoolean(
  process.env.HCSCREENSHOT_EMULATE_MEDIA_TYPE_SCREEN_ENABLED
)
// use as Accept-Language Header https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Accept-Language
export const ACCEPT_LANGUAGE = process.env.HCSCREENSHOT_ACCEPT_LANGUAGE ?? undefined

/**
 * Server
 * Fasitify Server options
 * https://github.com/fastify/fastify/blob/master/docs/Server.md
 */
export const SERVER_ADDRESS = process.env.HCSCREENSHOT_SERVER_ADDRESS ?? '127.0.0.1'
export const SERVER_PORT = toNumber(process.env.HCSCREENSHOT_SERVER_PORT) ?? 8080
// 10MiB
export const FASTIFY_BODY_LIMIT = toNumber(
  process.env.HCSCREENSHOT_FASTIFY_BODY_LIMIT ?? '10485760'
)
// https://www.fastify.io/docs/latest/Logging/
export const FASTIFY_LOG_LEVEL = process.env.HCSCREENSHOT_FASTIFY_LOG_LEVEL ?? 'info'
// if set use as key, else disabled
export const BEARER_AUTH_SECRET_KEY =
  process.env.HCSCREENSHOT_BEARER_AUTH_SECRET_KEY ?? undefined

/**
 * Testing
 */
export const TEST_TARGET_URL =
  process.env.HCSCREENSHOT_TEST_TARGET_URL ?? 'https://www.example.com'

/**
 * Viewport
 * @see https://pptr.dev/#?product=Puppeteer&show=api-pageviewport
 */
export const DEFAULT_VIEWPORT = {
  width: toNumber(process.env.HCSCREENSHOT_VIEWPORT_WIDTH) ?? 800,
  height: toNumber(process.env.HCSCREENSHOT_VIEWPORT_HEIGHT) ?? 600,
  deviceScaleFactor: toNumber(process.env.HCSCREENSHOT_DEVICE_SCALE_FACTOR) ?? 1,
  isMobile: toBoolean(process.env.HCSCREENSHOT_VIEWPORT_IS_MOBILE),
  isLandscape: toBoolean(process.env.HCSCREENSHOT_VIEWPORT_HAS_TOUCH),
  hasTouch: toBoolean(process.env.HCSCREENSHOT_VIEWPORT_IS_LANDSCAPE),
}
