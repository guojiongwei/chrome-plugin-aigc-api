/** 处理代码格式标签 */
export function filterMark() {
  let flag = false
  let lastIndex = -1
  return (msg = '') => {
    msg = msg.replace(/```/g, '\n```')
    const index = msg.lastIndexOf('```')
    if (index !== lastIndex) {
      flag = !flag
      lastIndex = index
    }
    if (flag) {
      return `${msg} \n\`\`\``
    }
    return msg
  }
}
