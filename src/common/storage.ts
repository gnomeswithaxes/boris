import type { IFavoriteDeck, ISavedUrl } from './interfaces'

export interface SyncStorage {
  auto: boolean
  printVersion: boolean
  images: boolean
  shoppingWizard: boolean
  favorite_decks: IFavoriteDeck[]
  reference: number
}

export interface LocalStorage {
  urls: ISavedUrl[]
}

export interface SessionStorage {
  cartSellers: string[]
}

const syncDefaults: SyncStorage = {
  auto: false,
  printVersion: false,
  images: true,
  shoppingWizard: false,
  favorite_decks: [],
  reference: -1,
}

export function getSyncSetting<K extends keyof SyncStorage>(key: K): Promise<SyncStorage[K]> {
  return new Promise(resolve => {
    chrome.storage.sync.get(key, result => {
      resolve((result[key] as SyncStorage[K]) ?? syncDefaults[key])
    })
  })
}

export function setSyncSetting<K extends keyof SyncStorage>(key: K, value: SyncStorage[K]): Promise<void> {
  return chrome.storage.sync.set({ [key]: value })
}

export function getSyncSettings<K extends keyof SyncStorage>(keys: K[]): Promise<Pick<SyncStorage, K>> {
  return new Promise(resolve => {
    chrome.storage.sync.get(keys as string[], result => {
      const settings = {} as Pick<SyncStorage, K>
      for (const key of keys) {
        settings[key] = (result[key] as SyncStorage[K]) ?? syncDefaults[key]
      }
      resolve(settings)
    })
  })
}

export function getLocalSetting<K extends keyof LocalStorage>(key: K): Promise<LocalStorage[K] | undefined> {
  return new Promise(resolve => {
    chrome.storage.local.get(key, result => {
      resolve(result[key] as LocalStorage[K] | undefined)
    })
  })
}

export function setLocalSetting<K extends keyof LocalStorage>(key: K, value: LocalStorage[K]): Promise<void> {
  return chrome.storage.local.set({ [key]: value })
}

export function getSessionSetting<K extends keyof SessionStorage>(key: K): Promise<SessionStorage[K] | undefined> {
  return chrome.storage.session.get(key).then(result => result[key] as SessionStorage[K] | undefined)
}

export function setSessionSetting<K extends keyof SessionStorage>(key: K, value: SessionStorage[K]): Promise<void> {
  return chrome.storage.session.set({ [key]: value })
}
