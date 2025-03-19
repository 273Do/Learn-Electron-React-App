function App(): JSX.Element {
  const handleClick = () => {
    // nativeTheme.themeSource = nativeTheme.shouldUseDarkColors ? 'light' : 'dark'
    // console.log('click')
    window.myAPI.toggleDarkmode()
  }
  return (
    <>
      <p className="mt-2 text-sm text-black dark:text-white">hello electron</p>
      <button
        className="rounded-lg border border-black p-2 text-sm text-black dark:border-white dark:text-white"
        onClick={handleClick}
      >
        change theme
      </button>
    </>
  )
}

export default App
