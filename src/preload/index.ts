import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge, ipcRenderer } from 'electron'

// Custom APIs for renderer
const api = {}

//`ContextBridge`APIを使用してelectron APIを公開
//コンテキスト分離が有効になっている場合にのみレンダラー
//DOMグローバルに追加してください。
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)

    // ダークモードの切り替えを行う関数
    contextBridge.exposeInMainWorld('setTheme', {
      toggleDarkmode: () => ipcRenderer.invoke('toggle-darkmode'),
      setSystemTheme: () => ipcRenderer.invoke('set-system-theme')
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-expect-error (define in dts)
  window.electron = electronAPI
  // @ts-expect-error (define in dts)
  window.api = api
}
