/** 对对象做key排序 */
export function sortObject(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }
  if (Array.isArray(obj)) {
    return obj.map(sortObject)
  }
  const sortedObj: any = {}
  Object.keys(obj)
    .sort()
    .forEach(key => {
      sortedObj[key] = sortObject(obj[key])
    })
  return sortedObj
}

/** base64加解密，支持中文 */
export const base64 = {
  decode(str: string) {
    return decodeURIComponent(
      window
        .atob(str)
        .split('')
        .map(c => {
          return `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`
        })
        .join(''),
    )
  },
}

/** Uint8Array格式转字符串 */
export function Uint8ArrayToString(uint8Array: Uint8Array) {
  const decoder = new TextDecoder('utf-8')
  const decodedString = decoder.decode(uint8Array) || ''
  return decodedString
}

export const timeout = (time: number) => {
  return new Promise<void>(resolve => {
    setTimeout(() => resolve(), time)
  })
}

/** 上下方向滚动 */
export const onScroll = (
  el: Element,
  type: 'top' | 'bottom' = 'bottom',
  behavior?: ScrollBehavior,
  scrollTop?: number,
  timeout = 100,
) => {
  setTimeout(() => {
    if (el) {
      el.scrollTo({
        top: scrollTop ?? (type === 'bottom' ? el.scrollHeight : 0),
        behavior: behavior || 'smooth',
      })
    }
  }, timeout)
}

export const onScrollElBottom = (el: Element, timeout = 100) => {
  if (!el) return
  const { scrollTop, clientHeight, scrollHeight } = el
  if (scrollTop + clientHeight >= scrollHeight - 10) {
    setTimeout(() => {
      el.scrollTop = Number.MAX_SAFE_INTEGER
    }, timeout)
  }
}

export const filterMarkdown = (str = '') => {
  return str.replace(/(\*)|(`)|(#)|( )|(请求方式)|(接口地址)/g, '')
}

export function renderSuncess(type: string, data: unknown) {
  return JSON.stringify({
    type,
    code: 200,
    msg: 'success',
    data,
  })
}

export function renderError(type: string, msg: string) {
  return JSON.stringify({
    type,
    code: 500,
    msg,
    data: null,
  })
}
