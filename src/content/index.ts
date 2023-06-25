import { renderError, renderSuncess } from './tools'
import { getSwaggerBootstrapUiAPi } from './swaggerBootUi'
import { getYapiJson } from './yapi'
import { getSwaggerUIJson } from './swaggerUi'
import { getSwaggerDocJSON } from './swaggerDoc'

/** 监听来自popup的消息 */
chrome.runtime.onMessage.addListener(async request => {
  const action = JSON.parse(request)
  switch (action.type) {
    case 'GET_API_JSON':
      const res = await getTsAPiJson()
      chrome.runtime.sendMessage(JSON.stringify({ type: 'GET_API_JSON_SUCCESS', payload: res }))
      break
    default:
      break
  }
})

/** 获取api 解析后的数据 */
async function getTsAPiJson() {
  try {
    let docText = ''
    if (location.origin.includes('yapi.txbapp.com')) {
      docText = await getYapiJson()
    } else if (location.href.includes('swagger-ui.html')) {
      docText = await getSwaggerUIJson()
    } else if (location.href.includes('doc.html')) {
      docText = await getSwaggerDocJSON()
    } else {
      docText = await getSwaggerBootstrapUiAPi()
    }
    if (docText) return renderSuncess('SEND_API_JSON', docText)
  } catch (error: any) {
    return renderError('SEND_API_JSON', error.message)
  }
  return renderError('SEND_API_JSON', '未获取api文档信息，请重试!')
}
