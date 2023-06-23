import { renderError, renderSuncess } from './tools'
import { getSwaggerBootstrapUiAPi } from './swaggerBootUi'
import { getYapiJson } from './yapi'
import { getSwaggerUIJson } from './swaggerUi'

/** 监听来自popup的消息 */
chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  const action = JSON.parse(request)
  switch (action.type) {
    case 'GET_API_JSON':
      sendResponse(getTsAPiJson())
      break
    default:
      sendResponse(false)
      break
  }
})

/** 获取api 解析后的数据 */
function getTsAPiJson() {
  try {
    if (location.origin.includes('yapi.txbapp.com')) {
      return getYapiJson()
    }
    if (location.href.includes('swagger-ui.html')) {
      return getSwaggerUIJson()
    }
    const docText = getSwaggerBootstrapUiAPi()
    if (docText) return renderSuncess('SEND_API_JSON', docText)
  } catch (error: any) {
    return renderError('SEND_API_JSON', error.message)
  }
  return renderError('SEND_API_JSON', '未获取api文档信息，请重试!')
}
