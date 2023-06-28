import classNames from 'classnames'
import { useEffect, useMemo } from 'preact/hooks'
import toast from '@/utils/toast'
import styles from './index.module.less'

const marked = window.marked.marked
const hljs = window.hljs

interface IMarkDownProps {
  content: string
  showMark?: boolean
  defaultLang?: string
}

document.addEventListener('click', (e: any) => {
  if (e.target?.classList?.contains('hljs-copy-btn')) {
    try {
      navigator.clipboard.writeText(e.target.parentNode.nextSibling.textContent)
      toast.show('复制成功!')
    } catch (error) {
      toast.show('复制失败！')
    }
  }
})

const MarkDown = (props: IMarkDownProps) => {
  const { content, showMark = false, defaultLang } = props

  useEffect(() => {
    marked.setOptions({
      renderer: new marked.Renderer(),
      gfm: true,
      tables: true,
      breaks: true,
      pedantic: false,
      sanitize: true,
      smartLists: true,
      smartypants: false,
      highlight(code: string, lang: string) {
        const language = hljs.getLanguage(lang) ? lang : defaultLang
        const value = hljs.highlight(code, { language }).value
        return `<div class=${styles.copy}>
        <span>${language || ''}</span>
        <span class='hljs-copy-btn'>复制代码</span>
        </div><div class=${styles.code}>${value}</div>`
      },
    })
  }, [defaultLang])

  const options = useMemo(() => {
    return {
      __html: marked(content ?? ''),
    }
  }, [content])

  return (
    <div
      className={classNames(styles.markdownWrap, '__markdown_wrap__', {
        [styles.showMark]: showMark,
      })}
      dangerouslySetInnerHTML={options}
    />
  )
}

export default MarkDown
