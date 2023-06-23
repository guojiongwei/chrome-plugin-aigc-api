import { ask35Api } from '@/common/api'
import { filterMark } from './fun'
import { Uint8ArrayToString, timeout } from './tools'
import { IAsk35Params } from '@/common/types'

interface IAskGptOption {
  sendMsg: IAsk35Params[]
  onStart: () => void
  onMessage: (msg: string) => void
  onError: (msg: string) => void
  onEnd: () => void
  onGetReader: (reader?: ReadableStreamDefaultReader<Uint8Array>) => void
}

export const onAskGpt = async (option: IAskGptOption) => {
  const { sendMsg, onStart, onMessage, onError, onEnd, onGetReader } = option
  let renderAnswer = '' // 渲染中的答案结果
  let answer = '' // 答案结果
  const _filterMark = filterMark()
  onStart?.()
  try {
    const response = await ask35Api({
      messages: sendMsg,
    })
    const reader = response?.body?.getReader()
    onGetReader?.(reader)
    while (reader) {
      const { value: chunk, done } = await reader.read()
      if (done) break
      try {
        const str = Uint8ArrayToString(chunk)
        answer += str
        console.log(answer)
        while (renderAnswer !== answer) {
          await timeout(10)
          renderAnswer = answer.substring(0, renderAnswer.length + 1)
          onMessage(_filterMark(renderAnswer))
        }
      } catch (error: any) {
        onError(error.message)
      }
    }
    await reader?.cancel?.()
  } catch (error: any) {
    onError(error.message)
  }
  onEnd()
}
