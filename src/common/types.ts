export interface IUser {
  avatar?: string
  email?: string
  id?: number
  mobile?: string
  name?: string
  userid?: string
  username?: string
  zylName?: string
}

export interface ISessionItem {
  id: number
  aid?: number
  uid?: number
  title?: string
  conv_created_at?: string
}

export interface ISessionData {
  list: ISessionItem[]
}

/** 添加消息参数 */
export interface IAddMsgParams {
  aid: number
  uid: number
  parts: string
  author: number
  end_turn: 1 | 2
  u_name: string
  local_cid: number
  msg_id: string
  parent_id: string
}

export interface IMsgItem {
  aid: number
  author: number
  children_id: string[]
  end_turn: number
  id: number
  local_cid: number
  msg_id: string
  parent_id: string
  parts: string
  res_at: string
  uid: number
  u_name: string
}

export interface IMsgData {
  list: IMsgItem[]
  total: number
}

export interface IAsk35Params {
  role: 'user' | 'assistant'
  content: string
}

export interface IErroeReson {
  errorMsg?: string
  code?: string
  parent_id?: string
  msg?: string
  lastMsg?: IMsgItem[]
}
