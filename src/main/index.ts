import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import {
  app,
  shell,
  BrowserWindow,
  ipcMain,
  Menu,
  MenuItemConstructorOptions,
  nativeTheme
} from 'electron'
import { join } from 'path'

import icon from '../../resources/icon.png?asset'

/**
 * メインウィンドウを作成する関数
 */
function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false, // 初期表示時にウィンドウを非表示にする
    autoHideMenuBar: true, // メニューバーを自動で非表示にする
    // transparent: true, // ウィンドウを透明にする
    // frame: false, // フレームレスウィンドウ（ウィンドウの枠をなくす）
    // titleBarStyle: 'hidden', // タイトルバーを非表示にする
    vibrancy: 'under-window', // macOSのウィンドウ全体に適用する
    visualEffectState: 'active', // Vibrancy（背景のぼかし）を常に適用
    ...(process.platform === 'linux' ? { icon } : {}), // Linux用のアイコンを設定
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'), // プリロードスクリプトを指定
      sandbox: false // サンドボックスを無効化
    }
  })

  // ウィンドウが表示準備完了後に表示する
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // macOS用のVibrancy（背景のぼかし）設定
  mainWindow.setVibrancy('sidebar') // サイドバーのVibrancyを適用
  // mainWindow.setVibrancy('content') // コンテンツ領域のVibrancyを適用

  // 外部リンクを開く際の挙動を設定（新しいウィンドウを開かせずにブラウザで開く）
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' } // ウィンドウの作成を拒否
  })

  // 開発モードでは、環境変数に設定されたURLをロード
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    // 本番モードでは、ローカルのHTMLファイルをロード
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// Electron の初期化が完了した際の処理
app.whenReady().then(() => {
  // Windows用のアプリケーションモデルIDを設定
  electronApp.setAppUserModelId('com.electron')

  // 開発時にF12でDevToolsを開閉できるようにし、本番環境ではCommandOrControl + Rを無効化
  // 詳細: https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC通信のテスト（フロントエンドから "ping" が送信されたら "pong" を出力）
  ipcMain.on('ping', () => console.log('pong'))

  // メインウィンドウを作成
  createWindow()

  // macOSでは、ウィンドウが全て閉じてもアプリケーションを終了しない（Cmd + Q で終了）
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  // ポップアップメニューを作成
  // const menu = Menu.buildFromTemplate([
  //   {
  //     label: 'File',
  //     submenu: [
  //       {
  //         label: 'Close',
  //         accelerator: 'CmdOrCtrl+W',
  //         role: 'close'
  //       }
  //     ]
  //   },
  //   {
  //     label: 'Help',
  //     submenu: [
  //       {
  //         label: 'Console Log',
  //         click: () => console.log('context-menu')
  //       }
  //     ]
  //   }
  // ])

  const template: MenuItemConstructorOptions[] = [
    {
      label: 'Window',
      submenu: [
        {
          label: 'Toggle Darkmode',
          accelerator: 'Ctrl+Shift+D',
          type: 'checkbox',
          id: 'darkmode',
          checked: nativeTheme.shouldUseDarkColors,
          // ダークモードへの切り替え
          click: () => {
            nativeTheme.themeSource = nativeTheme.shouldUseDarkColors ? 'light' : 'dark'
          }
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Console Log',
          click: () => console.log('context-menu')
        }
      ]
    }
  ]

  // アプリケーションメニューにカスタムメニューを適用
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
})

// macOS以外のOSでは、すべてのウィンドウが閉じたらアプリを終了
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// ここにアプリのメインプロセスの処理を追加可能
// 必要に応じて他のファイルから処理を読み込むことも可能
