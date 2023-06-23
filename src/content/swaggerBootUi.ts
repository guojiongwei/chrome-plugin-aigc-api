/** 获取getSwaggerBootstrapUi文档api */
export function getSwaggerBootstrapUiAPi() {
  let index: number = 0
  const tabs = document.querySelector<HTMLLIElement>('#sbu-tab-home')?.parentNode?.children || []
  const docTexts = document.querySelectorAll<HTMLTextAreaElement>('[id^=docText]') || []
  for (let i = 0; i < tabs.length; i++) {
    if (tabs[i]?.classList.contains('layui-this')) {
      index = i
      break
    }
  }
  return docTexts[index - 1]?.value
}
