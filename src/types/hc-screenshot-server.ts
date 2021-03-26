import { Viewport } from 'puppeteer'

export interface GetQuerystring {
  url: string
}

export interface AppConfig {
  bearerAuthSecretKey?: string
  pagesNum?: number
  userAgent?: string
  pageTimeoutMilliseconds?: number
  emulateMediaTypeScreenEnabled?: boolean
  acceptLanguage?: string
  fastifyLogLevel?: string
  fastifyBodyLimit?: number
  viewport?: Viewport
}
