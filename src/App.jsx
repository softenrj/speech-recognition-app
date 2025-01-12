import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import './darkmode.css'
import SpeachArea from './SpeachArea'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="#" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Speech to Text Converter</h1>
      <SpeachArea />
      <p className="read-the-docs">
      Created with ❤️ by Raj
      </p>
    </>
  )
}

export default App
