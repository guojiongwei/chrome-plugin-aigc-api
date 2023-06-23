/** 获取当前窗口 */
export const getCurrentTab = () => {
  return new Promise<chrome.tabs.Tab>((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs){
      resolve(tabs?.[0])
    })
  })
}