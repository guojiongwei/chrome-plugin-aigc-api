/** 获取getSwaggerDoc文档api */
export function getSwaggerDocJSON() {
  let timer: NodeJS.Timer
  let count = 0
  return new Promise<string>(resolve => {
    setTimeout(() => {
      let index: number = 0
      const currentTab = document.querySelector('.ant-tabs-tab-active')
      const tabs = currentTab?.parentNode?.children || []
      for (let i = 0; i < tabs.length; i++) {
        if (tabs[i] === currentTab) {
          index = i
          break
        }
      }
      const btn = document.querySelectorAll<HTMLButtonElement>('[id^=btnCopyMarkdown]')[index - 1]
      try {
        btn?.click?.()
        document.querySelector('.ant-message')?.remove()
      } catch (error) {}
      timer = setInterval(() => {
        const textarea = document.querySelector<HTMLTextAreaElement>('textarea:not(.ace_text-input)')
        count++
        if (textarea.value || count === 50) {
          resolve(textarea?.value || '')
          clearInterval(timer)
          timer = null
        }
      }, 20)
    })
  })
}
