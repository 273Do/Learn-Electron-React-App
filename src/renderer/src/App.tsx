function App(): JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <>
      <p className="">hello electron</p>
    </>
  )
}

export default App
