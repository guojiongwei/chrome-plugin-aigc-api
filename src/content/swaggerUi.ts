/**
 * 获取Swagger UI的数据
 */
export function getSwaggerUIJson() {
  // 获取url后面的哈希值
  const hashData = decodeURIComponent(location.hash).split('/')
  // 根据哈希找到id
  const id = `operations-${hashData[1]}-${hashData[2]}`
  const currentDom = document.getElementById(id)
  //遍历dom
  const domHead = currentDom.childNodes[0]
  const domBody = currentDom.childNodes[1]

  // 获取请求方法、请求路径、请求名称
  const method = domHead.childNodes[0].textContent
  const path = domHead.childNodes[1].childNodes[0].childNodes[0].textContent
  const title = domHead.childNodes[2].textContent

  // 获取请求参数
  let req_body = {}
  const paramDoms = (domBody as Element).querySelectorAll('.parameters tbody .parameters-col_name')
  // 如果不传递参数，就不用遍历了
  if (paramDoms.length === 0) {
    req_body = {}
  } else if (paramDoms.length === 1) {
    //可能是query参数，也可能是body参数
    const paramter_name = (paramDoms[0] as Element).querySelector('.parameter__name').textContent.replace(/[*\s]/g, '')
    const paramter_type = (paramDoms[0] as Element).querySelector('.parameter__type').textContent.replace(/\(+\)/g, '')
    const parameter_in = (paramDoms[0] as Element).querySelector('.parameter__in').textContent.replace(/\(|\)/g, '')
    if (parameter_in !== 'body') {
      req_body[paramter_name] = paramter_type
    } else {
      const bodyDom = (domBody as Element).querySelectorAll(
        '.parameters tbody .parameters-col_description .body-param__example',
      )
      let text = ''
      ;(bodyDom[0] as Element).querySelectorAll('span').forEach(span => {
        text += span.innerText
      })
      req_body = JSON.parse(text)
    }
  } else {
    //只能是query参数
    const newObj = {}
    for (let i = 0; i < paramDoms.length; i++) {
      const paramter_name = (paramDoms[i] as Element)
        .querySelector('.parameter__name')
        .textContent.replace(/[*\s]/g, '')
      const paramter_type = (paramDoms[i] as Element)
        .querySelector('.parameter__type')
        .textContent.replace(/\(+\)/g, '')
      newObj[paramter_name] = paramter_type
    }
    for (let key in newObj) {
      req_body[key] = newObj[key].replace(/\(.+\)/g, '')
    }
  }
  // 获取返回数据
  let res_body = {}
  const resDom = (domBody as Element).querySelectorAll('.response .highlight-code .example')
  let text = ''
  ;(resDom[0] as Element).querySelectorAll('span').forEach(span => {
    text += span.innerText
  })
  res_body = JSON.parse(text)

  const data = title
    ? `${title}\n${path}\n${method}\n接口请求参数:${JSON.stringify(req_body)}\n接口返回数据:${JSON.stringify(res_body)}`
    : ''
  return data
}
