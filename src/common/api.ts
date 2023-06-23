import { IAsk35Params } from './types'

/** 获取流数据 */
export const ask35Api = async (params: { messages: IAsk35Params[] }) => {
  return fetch('https://chat.guojiongwei.top/chat', {
    method: 'POST',
    headers: {
      accept: 'text/event-stream',
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(params),
  })
}
