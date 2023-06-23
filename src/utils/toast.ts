// @ts-nocheck

const toast = {
  show(content, time = 2000) {
    document.querySelector('#toast') && document.querySelector('#toast').remove()
    window['ToastDelayRem'] && clearTimeout(window['ToastDelayRem'])
    document.body.insertAdjacentHTML(
      'beforeEnd',
      `<div id="toast" class="toast"><div class="message">${content}</div><div style="display: ${
        time > 0 ? 'none' : 'block'
      };" class="overlay"></div></div>`,
    )
    document.querySelector('#toast').style.display = 'flex'
    if (time > 0) {
      window['ToastDelayRem'] = setTimeout(() => {
        document.querySelector('#toast') && document.querySelector('#toast').remove()
      }, time)
    }
  },
  clear() {
    document.querySelector('#toast') && document.querySelector('#toast').remove()
  }
}

export default toast
