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
    contextBridge.exposeInMainWorld('myAPI', {
      toggleDarkmode: () => ipcRenderer.invoke('toggle-darkmode')
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
