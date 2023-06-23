import { IUser } from './types'

export const localStorageKey = ''

interface ILocalStorage<T> {
  key: string
  defaultValue: T
}
const storage = chrome.storage.local
export class LocalStorage<T> implements ILocalStorage<T> {
  key: string

  defaultValue: T

  constructor(key: string, defaultValue: any) {
    this.key = localStorageKey + key
    this.defaultValue = defaultValue
  }

  setItem(value: T) {
    storage.set({ [this.key]: JSON.stringify(value) })
  }

  removeItem() {
    storage.remove(this.key)
  }

  async getItem(): Promise<T> {
    const res = await storage.get(this.key)
    const value = res[this.key]
    if (value === undefined) return this.defaultValue
    try {
      return value && value !== 'null' && value !== 'undefined' ? (JSON.parse(value) as T) : this.defaultValue
    } catch (error) {
      return value && value !== 'null' && value !== 'undefined' ? (value as unknown as T) : this.defaultValue
    }
  }
}

export const userStorage = new LocalStorage<IUser>('user', {})
export const authTokenStorage = new LocalStorage<string>('token', '')

// 清除当前项目的本地存储
export const clearLocalStorage = () => {
  for (const key in localStorage) {
    if (key.includes(localStorageKey)) {
      storage.remove(key)
    }
  }
}
