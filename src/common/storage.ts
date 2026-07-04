import type { IPinnedList, ISavedUrl } from './interfaces'

export interface SyncStorage {
  auto: boolean
  printVersion: boolean
  images: boolean
  shoppingWizard: boolean
  pinned_lists: IPinnedList[]
  reference: number
}

export interface LocalStorage {
  urls: ISavedUrl[]
}

const syncDefaults: SyncStorage = {
  auto: false,
  printVersion: false,
  images: true,
  shoppingWizard: false,
  pinned_lists: [],
  reference: 1,
}

export function getSyncSetting<K extends keyof SyncStorage>(key: K): Promise<SyncStorage[K]> {
  return new Promise((resolve) => {
    chrome.storage.sync.get(key, (result) => {
      resolve((result[key] as SyncStorage[K]) ?? syncDefaults[key])
    })
  })
}

export function setSyncSetting<K extends keyof SyncStorage>(key: K, value: SyncStorage[K]): Promise<void> {
  return chrome.storage.sync.set({ [key]: value })
}

export function getSyncSettings<K extends keyof SyncStorage>(keys: K[]): Promise<Pick<SyncStorage, K>> {
  return new Promise((resolve) => {
    chrome.storage.sync.get(keys as string[], (result) => {
      const settings = {} as Pick<SyncStorage, K>
      for (const key of keys) {
        settings[key] = (result[key] as SyncStorage[K]) ?? syncDefaults[key]
      }
      resolve(settings)
    })
  })
}

export function getLocalSetting<K extends keyof LocalStorage>(key: K): Promise<LocalStorage[K] | undefined> {
  return new Promise((resolve) => {
    chrome.storage.local.get(key, (result) => {
      resolve(result[key] as LocalStorage[K] | undefined)
    })
  })
}

export function setLocalSetting<K extends keyof LocalStorage>(key: K, value: LocalStorage[K]): Promise<void> {
  return chrome.storage.local.set({ [key]: value })
}
