let DocsData: any = null

// 向页面注入JS
function injectCustomJs(jsPath = '') {
  jsPath = jsPath || '/assets/js/inject.js'
  var temp = document.createElement('script')
  temp.setAttribute('type', 'text/javascript')
  temp.src = chrome.runtime.getURL(jsPath)
  document.head.appendChild(temp)
}

if (location.origin.includes('yapi.txbapp.com')) {
  window.addEventListener('message', async function (e) {
    if (e?.data?.type === 'inject_message_type') {
      DocsData = e.data.message
    }
  })
  injectCustomJs()
}

/** 获取yapi的数据 */
export function getYapiJson() {
  const data = DocsData
    ? `${DocsData.title}` +
      '\n' +
      `${DocsData.path}` +
      '\n' +
      `${DocsData.method}` +
      '\n' +
      `接口请求参数:${DocsData.req_body_other}` +
      `接口返回数据:${DocsData.res_body}`
    : ''
  console.log('data', data)
  return JSON.stringify({ code: 200, data })
}
