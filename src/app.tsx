import { useEffect, useRef, useState } from 'preact/hooks'
import { IErroeReson } from '@/common/types'
import { getCurrentTab } from '@/utils/chrome'
import toast from '@/utils/toast'
import { onAskGpt } from '@/utils/askGpt'
import { filterMarkdown, onScrollElBottom } from '@/utils/tools'
import { MarkDown } from '@/components'
import styles from '@/app.module.less'
import { templateMap } from '@/common/config'

const fliterMap: { [index: string]: true } = {
  '': true,
  '**consumes** ``': true,
  '**produces** `["*/*"]`': true,
  '**接口描述** ``': true,
}

const App = () => {
  /** 发送获取api文档信息消息 */
  const onGetApiData = async () => {
    const currentTab = await getCurrentTab()
    if (!currentTab.url.startsWith('http')) return
    const action = { type: 'GET_API_JSON' }
    chrome.tabs.sendMessage(currentTab?.id!, JSON.stringify(action))
  }

  /** 接收api文档信息 */
  const onListenApiData = () => {
    chrome.runtime.onMessage.addListener(function (request) {
      const action = JSON.parse(request)
      const { type, payload } = action
      // 存储token和用户信息
      if (type === 'GET_API_JSON_SUCCESS') {
        if (!payload) return
        const action = JSON.parse(payload)
        const { code, data } = action
        onSendApiJSON(code, data)
      }
    })
  }

  useEffect(() => {
    onListenApiData()
    onGetApiData()
  }, [])

  const [currentApi, setCurrentApi] = useState<string[]>([])
  const sendMsgRef = useRef<string>('')
  const initLoadRef = useRef(true)
  /** 解析文档内容 */
  const onSendApiJSON = (code: number, data = '') => {
    if (code === 200) {
      const info = data
        .split('**响应示例**')[0]
        .split('\n')
        .filter(item => Boolean(item.trim) && !fliterMap[item])
      setCurrentApi(info)
      sendMsgRef.current = info.join('\n')
    } else {
      setCurrentApi([])
      sendMsgRef.current = ''
      if (!initLoadRef.current) toast.show('未获取api文档信息!')
      initLoadRef.current = false
    }
  }

  /** 响应内容 */
  const [content, setContent] = useState<string>('')
  const [askErrorReson, setAskErrorReson] = useState<IErroeReson>({})
  const [asking, setAsking] = useState(false)
  const askingRef = useRef(asking)
  const scrollRef = useRef<HTMLDivElement>(null)
  const renderRef = useRef<ReadableStreamDefaultReader<Uint8Array>>()

  /** 当前的语言 */
  const [language, setLanguage] = useState('typescript')
  useEffect(() => {
    chrome.storage.local.get('language').then(res => {
      if (res.language) setLanguage(res.language)
    })
  }, [])

  /** 开始询问问题 */
  const onAsk = async () => {
    if (!sendMsgRef.current) return toast.show('未获取api文档信息!')
    onAskGpt({
      sendMsg: [{ role: 'user', content: onGetWord() + sendMsgRef.current.replace(/( )|(--)/g, '') }],
      async onStart() {
        if (renderRef.current) await renderRef.current.cancel()
        askingRef.current = true
        setAsking(true)
        setContent('')
        setAskErrorReson({})
      },
      onEnd() {
        setAsking(false)
        askingRef.current = false
        renderRef.current = undefined
      },
      onGetReader(reader) {
        renderRef.current = reader
      },
      onMessage(msg) {
        setContent(msg)
        onScrollElBottom(scrollRef.current)
      },
      onError(msg) {
        setAskErrorReson({ errorMsg: msg })
      },
    })
  }

  /** 停止生成 */
  const onStop = async () => {
    if (renderRef.current) await renderRef.current.cancel()
    setAsking(false)
    askingRef.current = false
    renderRef.current = undefined
  }

  const [editing, setEditing] = useState(false)
  const [template, setTemplate] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>()
  /** 缓存当前语言和模版 */
  useEffect(() => {
    if (language) {
      chrome.storage.local.get(language).then(res => {
        setTemplate(res[language] || templateMap[language] || '')
      })
      chrome.storage.local.set({ language })
    }
  }, [language, editing])

  /** 编辑模版 */
  const onEditTemplate = () => {
    setEditing(true)
    textareaRef.current.value = template
  }

  /** 确认修改模版 */
  const onCOnfirmTemplate = () => {
    chrome.storage.local.set({ [language]: template })
    setEditing(false)
  }

  /** 获取提词 */
  const onGetWord = () => {
    return `根据下面的api文档，用${language}生成封装请求接口${
      template
        ? `以下代码为返回的模版：
        ${template}`
        : ''
    }。只返回代码和对应模版注释，代码前后带上\`\`\`。\n`
  }

  return (
    <div className={styles.popup}>
      <h2 className={styles.title}>
        <span>AIGC-API</span>
      </h2>
      <div className={styles.content} ref={scrollRef}>
        <div className={styles.apiInfo}>
          <h3>api文档信息</h3>
          {!!currentApi.length ? (
            <>
              <div className={styles.formItem}>
                <span>接口名称：</span>
                {filterMarkdown(currentApi[0])}
              </div>
              <div className={styles.formItem}>
                <span>接口路径：</span>
                {filterMarkdown(currentApi[1])}
              </div>
              <div className={styles.formItem}>
                <span>请求方式：</span>
                {filterMarkdown(currentApi[2])}
              </div>
            </>
          ) : (
            <div className={styles.nofindApi}>
              未获取api文档信息，请<span onClick={onGetApiData}>重试</span>！
            </div>
          )}
          <h3 className={styles.subTitle}>配置项</h3>
          <div className={styles.formItem}>
            <span>生成语言：</span>
            <select name='lang' onChange={(e: any) => setLanguage(e.target.value)} value={language}>
              <option value='typescript'>typescript</option>
              <option value='javascript'>javascript</option>
              <option value='java'>java</option>
              <option value='python'>python</option>
              <option value='golang'>golang</option>
              <option value='php'>php</option>
              <option value='unity'>unity</option>
              <option value='dart'>dart</option>
              <option value='c++'>c++</option>
            </select>
          </div>
          <div className={styles.formItem}>
            <span>模版配置：</span>
            <span>{template ? '自定义模版' : '无'}</span>
            {editing && (
              <a className='clicl-text' onClick={() => setEditing(false)}>
                取消
              </a>
            )}
            &nbsp;
            <a className='clicl-text' onClick={editing ? onCOnfirmTemplate : onEditTemplate}>
              {editing ? '确定' : '编辑'}
            </a>
          </div>
          <div className={styles.editTemplate} style={{ display: editing ? 'block' : 'none' }}>
            <textarea placeholder='请输入接口请求模版示例' className={styles.templateIpt} ref={textareaRef}></textarea>
          </div>
        </div>
        {!askErrorReson.errorMsg ? (
          <MarkDown content={content} showMark={asking} defaultLang={language} />
        ) : (
          <div className={styles.errorMsg}>{askErrorReson.errorMsg}</div>
        )}
      </div>
      <footer className={styles.footer}>
        <button
          className={styles.apiBtn}
          onClick={asking ? onStop : onAsk}
          style={{ background: asking ? '#ff4d4f' : '#00b96b' }}
        >
          {asking ? '停止生成' : content ? '重新生成' : '生成代码'}
        </button>
      </footer>
    </div>
  )
}

export default App
