function App(): JSX.Element {
  const handleClick = () => {
    // nativeTheme.themeSource = nativeTheme.shouldUseDarkColors ? 'light' : 'dark'
    // console.log('click')
    window.setTheme.toggleDarkmode()
  }

  const handleSystemThemeClick = () => {
    window.setTheme.setSystemTheme()
  }
  return (
    <>
      <div className="draggable h-3 w-full bg-slate-600"></div>
      <p className="mt-2 text-sm text-black dark:text-white">hello electron</p>
      <div className="flex gap-2">
        <button
          className="rounded-lg border border-black p-2 text-sm text-black dark:border-white dark:text-white"
          onClick={handleClick}
        >
          change theme
        </button>
        <button
          className="rounded-lg border border-black p-2 text-sm text-black dark:border-white dark:text-white"
          onClick={handleSystemThemeClick}
        >
          system theme
        </button>
      </div>
    </>
  )
}

export default App
