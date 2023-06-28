import { render } from 'preact'
import App from './app'
import './index.css'
import '@/assets/css/toast.css'

render(<App />, document.getElementById('app') as HTMLElement)
